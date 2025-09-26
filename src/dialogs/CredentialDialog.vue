<script lang="ts" setup>
import { delete_credential, save_credential} from '@/api/credentials';
import { CredentialScheme } from '@/api/types';

const props = defineProps<{
    visible:boolean;
    credential:CredentialScheme;
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
    await delete_credential(props.credential);
    emits('onSave');
}

async function submit()
{
    await save_credential({
        id: props.credential.id,
        name: props.credential.name,
        configuration: JSON.parse(props.credential.configurationString || '{}')
    });
    emits('onSave');
}

</script>
<template>
    <el-dialog :model-value="props.visible" title="Edit Credential" :close-on-click-modal="false"  :before-close="(done:any) => { close(); done(false); }">
        <el-form>
        <el-form-item label="Name">
          <el-input :model-value="props.credential.name" @update:model-value="(e) => update('name', e)"/>
        </el-form-item>
        <el-form-item label="Configuration">
          <el-input :model-value="props.credential.configurationString" @update:model-value="(e) => update('configuration', e)"   :rows="8" type="textarea" :autosize="{minRows:5, maxRows:15}"/>
        </el-form-item>
    </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="warning" @click="remove" v-if="(props.credential.id ?? 0) > 0">Delete</el-button>
          <el-button type="secondary" @click="close">Cancel</el-button>
          <el-button type="primary" @click="submit">Save</el-button>
        </span>
      </template>        
    </el-dialog>
</template>