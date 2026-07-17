<script lang="ts" setup>
import { StatusListConfig } from '@/types';

const props = defineProps<{
    statuslist:StatusListConfig;
    showAdd?:boolean;
}>();
const emits = defineEmits(['onUpdate', 'onRemove', 'onAdd']);

function update(fieldName:string, value: any)
{
    emits('onUpdate', {field: fieldName, value: value});
}

import { Plus, Delete } from '@element-plus/icons-vue';
</script>
<template>
    <div class="statuslistentry">
        <el-form-item label="Name">
          <el-input :model-value="props.statuslist.name" @update:model-value="(e) => update('name', e)"/>
        </el-form-item>
        <el-form-item label="Type">
          <el-select :model-value="props.statuslist.type" @update:model-value="(e) => update('type', e)">
            <el-option value="statuslist+jwt" label="statuslist+jwt" />
            <el-option value="BitstringStatusList" label="BitstringStatusList" />
          </el-select>
        </el-form-item>
        <el-form-item label="Size">
          <el-input :model-value="props.statuslist.size" @update:model-value="(e) => update('size', e)"/>
        </el-form-item>
        <el-form-item label="Bit size">
          <el-input :model-value="props.statuslist.bitSize" @update:model-value="(e) => update('bitSize', e)"/>
        </el-form-item>
        <el-form-item label="Purpose">
          <el-input :model-value="props.statuslist.purpose" @update:model-value="(e) => update('purpose', e)"/>
        </el-form-item>
        <div class="statuslistrow">
            <el-button class='statuslist-remove' type="danger" :icon="Delete" @click="emits('onRemove')"/>
            <el-button v-if="props.showAdd" class='statuslist-add' type="primary" :icon="Plus" @click="emits('onAdd')"/>
        </div>
    </div>
</template>
