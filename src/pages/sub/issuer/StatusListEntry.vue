<script lang="ts" setup>
import { delete_issuer, save_issuer } from '@/api/issuers';
import { StatusList } from '@/types';

const props = defineProps<{
    statuslist:StatusList;
}>();
const emits = defineEmits(['onClose', 'onUpdate', 'onSave']);

function update(fieldName:string, value: any)
{
    console.log('updating ', fieldName, value);
    emits('onUpdate', {field: fieldName, value: value});
}

</script>
<template>
    <div>
        <el-form-item label="URL">
          <el-input :model-value="props.statuslist.url" @update:model-value="(e) => update('url', e)"/>
        </el-form-item>
        <el-form-item label="Revoke">
          <el-input :model-value="props.statuslist.revoke" @update:model-value="(e) => update('revoke', e)"/>
        </el-form-item>
        <el-form-item label="Token">
          <el-input :model-value="props.statuslist.token" @update:model-value="(e) => update('token', e)"/>
        </el-form-item>
    </div>
</template>