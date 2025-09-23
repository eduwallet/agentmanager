<script lang="ts" setup>
import { FieldValue, StatusList } from '@/types';

const props = defineProps<{
    credential:string;
    statuslists:StatusList[];
}>();
const emits = defineEmits(['onUpdate']);

function update(fieldName:string, value: any)
{
    emits('onUpdate', {field: fieldName, value: value});
}

function updateField(index:number, f:FieldValue)
{
    console.log('updating ', index, f);
    f.index=index;
    emits('onUpdate', f);
}

function addBlock()
{
    emits('onUpdate', {field: 'add', value:''});
}

import StatusListEntry from './StatusListEntry.vue';
import { Plus } from '@element-plus/icons-vue';
</script>
<template>
    <div class="statuslistcredential">
        <el-form-item label="Credential">
          <el-input :model-value="props.credential" @update:model-value="(e) => update('credential', e)"/>
        </el-form-item>
        <div class="statuslistblock">
            <StatusListEntry v-for="(lst, index) in props.statuslists" :key="index" :statuslist="lst" @on-update="(e) => updateField(index, e)"/>
        </div>
        <el-button class='addicon' type="primary" :icon="Plus" @click="addBlock"/>
    </div>
</template>