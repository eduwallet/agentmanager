<script lang="ts" setup>
import { delete_context, save_context} from '@/api/contexts';
import { ContextScheme } from '@/api/types';
import { useTokenStore } from '@/stores/token';
import { computed } from 'vue';

const props = defineProps<{
    visible:boolean;
    context:ContextScheme;
}>();
const emits = defineEmits(['onClose', 'onUpdate', 'onSave']);
const store = useTokenStore();

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
    await delete_context(props.context);
    emits('onSave');
}

async function submit()
{
    const doc = JSON.parse(props.context.documentString || '{}');
    if (!doc) {
        alert("Document is invalid, please correct");
        return;
    }

    await save_context({
        id: props.context.id,
        name: props.context.name,
        path: props.context.path,
        document: JSON.parse(props.context.documentString || '{}')
    });
    emits('onSave');
}

const livelink = computed(() => {
    return store.url + props.context.path;
});

</script>
<template>
    <el-dialog :model-value="props.visible" title="Edit Context Document" :close-on-click-modal="false"  :before-close="(done:any) => { close(); done(false); }">
        <el-form>
        <el-form-item label="Name">
          <el-input :model-value="props.context.name" @update:model-value="(e) => update('name', e)"/>
        </el-form-item>
        <el-form-item label="Path">
          <el-input :model-value="props.context.path" @update:model-value="(e) => update('path', e)"/>
        </el-form-item>
        <el-form-item label="Configuration">
          <el-input :model-value="props.context.documentString" @update:model-value="(e) => update('document', e)" :rows="8" type="textarea" :autosize="{minRows:5, maxRows:15}"/>
        </el-form-item>
        <el-form-item label="Live">
          <a :href="livelink" target='_new'>context document</a>
        </el-form-item>
    </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="remove" v-if="(props.context.id ?? 0) > 0">Delete</el-button>
          <el-button type="warning" @click="close">Cancel</el-button>
          <el-button type="primary" @click="submit">Save</el-button>
        </span>
      </template>        
    </el-dialog>
</template>