<script lang="ts" setup>
import { delete_presentation, save_presentation} from '@/api/presentations';
import { PresentationSchema } from '@/api/types';

const props = defineProps<{
    visible:boolean;
    presentation:PresentationSchema;
}>();
const emits = defineEmits(['onClose', 'onUpdate', 'onSave']);

function update(fieldName:string, value: any)
{
    emits('onUpdate', {field: fieldName, value: value});
}

function close()
{
    emits('onClose');
}

async function remove()
{
    await delete_presentation(props.presentation);
    emits('onSave');
}

async function submit()
{
    let input_descriptors:any = null;
    try {
        input_descriptors = JSON.parse(props.presentation.input_descriptors ?? '{}');
        if (!Array.isArray(input_descriptors)) {
            if (props.presentation.input_descriptors && props.presentation.input_descriptors.length) {
                throw new Error("JSON error");
            }
            else {
                input_descriptors = null;
            }
        }
    }
    catch (e:any) {
        alert('The PEX content should be an array of input descriptors. The value does not resolve in a proper array.');
        return;
    }

    let dcql:any = null;
    try {
        dcql = JSON.parse(props.presentation.query ?? '{}');
        if (!dcql || Object.keys(dcql).length == 0) {
            if (props.presentation.query && props.presentation.query.length) {
                throw new Error("JSON error");
            }
            else {
                dcql = null;
            }
        }
    }
    catch (e:any) {
        alert("The DCQL should be a proper JSON specification. The value does not resolve correctly");
        return;
    }

    await save_presentation({
        id: props.presentation.id,
        shortname: props.presentation.shortname,
        name: props.presentation.name,
        purpose: props.presentation.purpose,
        ...(input_descriptors !== null && {input_descriptors: JSON.stringify(input_descriptors)}),
        ...(dcql !== null && {query: JSON.stringify(dcql)}),
    });
    emits('onSave');
}

</script>
<template>
    <el-dialog :model-value="props.visible" title="Edit Presentation" :close-on-click-modal="false"  :before-close="(done:any) => { close(); done(false); }">
        <el-form>
        <el-form-item label="Short Name">
          <el-input :model-value="props.presentation.shortname" @update:model-value="(e) => update('shortname', e)"/>
        </el-form-item>
        <el-form-item label="Name">
          <el-input :model-value="props.presentation.name" @update:model-value="(e) => update('name', e)"/>
        </el-form-item>
        <el-form-item label="Purpose">
          <el-input :model-value="props.presentation.purpose" @update:model-value="(e) => update('purpose', e)"/>
        </el-form-item>
        <el-form-item label="PEX">
          <el-input :model-value="props.presentation.input_descriptors ?? ''" @update:model-value="(e) => update('input_descriptors', e)"   :rows="8" type="textarea" :autosize="{minRows:5, maxRows:15}"/>
        </el-form-item>
        <el-form-item label="DCQL">
          <el-input :model-value="props.presentation.query ?? ''" @update:model-value="(e) => update('query', e)"   :rows="8" type="textarea" :autosize="{minRows:5, maxRows:15}"/>
        </el-form-item>
    </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="remove" v-if="(props.presentation.id ?? 0) > 0">Delete</el-button>
          <el-button type="warning" @click="close">Cancel</el-button>
          <el-button type="primary" @click="submit">Save</el-button>
        </span>
      </template>        
    </el-dialog>
</template>