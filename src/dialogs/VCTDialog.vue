<script lang="ts" setup>
import { delete_vct, save_vct} from '@/api/vcts';
import { VCTScheme } from '@/api/types';
import { useTokenStore } from '@/stores/token';
import { computed } from 'vue';

const props = defineProps<{
    visible:boolean;
    vct:VCTScheme;
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
    await delete_vct(props.vct);
    emits('onSave');
}

async function submit()
{
    const doc = JSON.parse(props.vct.documentString || '{}');
    if (!doc) {
        alert("Document is invalid, please correct");
        return;
    }

    await save_vct({
        id: props.vct.id,
        name: props.vct.name,
        path: props.vct.path,
        credentials: (props.vct.credentialsString ?? '').split(',').map((i:string) => i.trim()),
        document: JSON.parse(props.vct.documentString || '{}')
    });
    emits('onSave');
}

const livelink = computed(() => {
    return store.url + props.vct.path;
});

</script>
<template>
    <el-dialog :model-value="props.visible" title="Edit VCT Document" :close-on-click-modal="false"  :before-close="(done:any) => { close(); done(false); }">
        <el-form>
        <el-form-item label="Name">
          <el-input :model-value="props.vct.name" @update:model-value="(e) => update('name', e)"/>
        </el-form-item>
        <el-form-item label="Path">
          <el-input :model-value="props.vct.path" @update:model-value="(e) => update('path', e)"/>
        </el-form-item>
        <el-form-item label="Credentials">
          <el-input :model-value="props.vct.credentialsString" @update:model-value="(e) => update('credentials', e)"/>
        </el-form-item>
        <el-form-item label="Configuration">
          <el-input :model-value="props.vct.documentString" @update:model-value="(e) => update('document', e)" :rows="8" type="textarea" :autosize="{minRows:5, maxRows:15}"/>
        </el-form-item>
        <el-form-item label="Live">
          <a :href="livelink" target='_new'>VCT document</a>
        </el-form-item>
    </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="warning" @click="remove" v-if="(props.vct.id ?? 0) > 0">Delete</el-button>
          <el-button type="secondary" @click="close">Cancel</el-button>
          <el-button type="primary" @click="submit">Save</el-button>
        </span>
      </template>        
    </el-dialog>
</template>