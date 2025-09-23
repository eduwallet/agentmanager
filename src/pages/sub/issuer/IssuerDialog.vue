<script lang="ts" setup>
import { ref } from 'vue';
import { delete_issuer, save_issuer } from '@/api/issuers';
import { IssuerScheme } from '@/api/types';

const props = defineProps<{
    visible:boolean;
    issuer:IssuerScheme;
}>();
const emits = defineEmits(['onClose', 'onUpdate', 'onSave']);

function update(fieldName:string, value: any)
{
    emits('onUpdate', {field: fieldName, value: value});
}

function closeForm()
{
    emits('onClose');
}

async function remove()
{
    await delete_issuer(props.issuer);
    console.log('emitting on close');
    emits('onSave');
}

async function submitForm()
{
    await save_issuer(props.issuer);
    emits('onSave');
}

const statdialog = ref(false);
function openStat()
{
  statdialog.value = true;
}
function closeStat()
{
  statdialog.value = false;
}

async function updateStat(e:any)
{
  console.log('updating status list value ', e);
  emits('onUpdate', {field: 'statusLists', value: e});
}

import StatusListDialog from './StatusListDialog.vue';
</script>
<template>
    <el-dialog :model-value="props.visible" title="Edit Issuer" :close-on-click-modal="false"  :before-close="(done:any) => { closeForm(); done(false); }">
      <el-form>
        <el-form-item label="Name">
          <el-input :model-value="props.issuer.name" @update:model-value="(e) => update('name', e)"/>
        </el-form-item>
        <el-form-item label="DID">
          <el-input :model-value="props.issuer.did" @update:model-value="(e) => update('did', e)"/>
        </el-form-item>
        <el-form-item label="Base URL">
          <el-input :model-value="props.issuer.baseUrl" @update:model-value="(e) => update('baseUrl', e)"/>
        </el-form-item>
        <el-form-item label="Admin Token">
          <el-input :model-value="props.issuer.adminToken" @update:model-value="(e) => update('adminToken', e)"/>
        </el-form-item>
        <el-form-item label="Authorization">
          <el-input :model-value="props.issuer.authorizationEndpoint" @update:model-value="(e) => update('authorizationEndpoint', e)"/>
        </el-form-item>
        <el-form-item label="Token">
          <el-input :model-value="props.issuer.tokenEndpoint" @update:model-value="(e) => update('tokenEndpoint', e)"/>
        </el-form-item>
        <el-form-item label="Client ID">
          <el-input :model-value="props.issuer.clientId" @update:model-value="(e) => update('clientId', e)"/>
        </el-form-item>
        <StatusListDialog :visible="statdialog" :issuer="props.issuer" @on-close="closeStat" @on-update="(e) => updateStat(e)"/>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="success" @click="openStat">StatusLists</el-button>
          <el-button type="danger" @click="remove">Delete</el-button>
          <el-button type="warning" @click="closeForm">Cancel</el-button>
          <el-button type="primary" @click="submitForm">Save</el-button>
        </span>
      </template>        
    </el-dialog>
</template>