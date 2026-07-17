<script lang="ts" setup>
import { list_credentials } from '@/api/credentials';
import { CredentialScheme } from '@/api/types';
import { FieldValue, MetadataCredential } from '@/types';
import { computed, onMounted, ref } from 'vue';
import type { Ref } from 'vue';

const props = defineProps<{
    name:string;
    credential:MetadataCredential;
}>();
const emits = defineEmits(['onUpdate']);

const credentials:Ref<CredentialScheme[]> = ref([]);
onMounted(async () => {
  credentials.value = await list_credentials();
})

function update(fieldName:string, value: any)
{
    const md = JSON.parse(JSON.stringify(props.credential));
    md.original = props.name;
    md.name = props.name;
    switch(fieldName) {
        case 'name':
        case 'format':
        case 'scope':
            md[fieldName] = value;
            break;
        case 'extends':
            if (value == 'none') {
              delete md[fieldName];
            }
            else {
              md[fieldName] = value;
            }
            break;
        case 'display':
            md.display = JSON.parse(value);
            break;
    }

    emits('onUpdate', md);
}

function addStatusList()
{
    const md = JSON.parse(JSON.stringify(props.credential));
    md.original = props.name;
    md.name = props.name;
    if (!md.statusLists) {
        md.statusLists = [];
    }
    md.statusLists.push({name:'', type:'statuslist+jwt', size:131072, bitSize:1, purpose:''});
    emits('onUpdate', md);
}

function updateStatusList(index:number, field:FieldValue)
{
    const md = JSON.parse(JSON.stringify(props.credential));
    md.original = props.name;
    md.name = props.name;
    if (!md.statusLists || index < 0 || index >= md.statusLists.length) {
        return;
    }
    switch (field.field) {
        case 'name':
        case 'type':
        case 'purpose':
            md.statusLists[index][field.field] = field.value;
            break;
        case 'size':
        case 'bitSize': {
            const num = parseInt(field.value);
            md.statusLists[index][field.field] = isNaN(num) ? 0 : num;
            break;
        }
    }
    emits('onUpdate', md);
}

function removeStatusList(index:number)
{
    const md = JSON.parse(JSON.stringify(props.credential));
    md.original = props.name;
    md.name = props.name;
    if (!md.statusLists || index < 0 || index >= md.statusLists.length) {
        return;
    }
    md.statusLists.splice(index, 1);
    emits('onUpdate', md);
}

const displayValue = computed(() => JSON.stringify(props.credential?.display ?? {}, null, 2));
const statusLists = computed(() => props.credential.statusLists ?? []);

import MetadataStatusListEntry from './MetadataStatusListEntry.vue';
import { Plus } from '@element-plus/icons-vue';
</script>
<template>
    <div class="metadatadisplay">
        <el-form-item label="ID">
          <el-input :model-value="props.name" @update:model-value="(e) => update('name', e)"/>
        </el-form-item>
        <el-form-item label="Format">
          <el-input :model-value="props.credential.format" @update:model-value="(e) => update('format', e)"/>
        </el-form-item>
        <el-form-item label="Scope">
          <el-input :model-value="props.credential.scope" @update:model-value="(e) => update('scope', e)"/>
        </el-form-item>
        <el-form-item label="Display">
          <el-input :model-value="displayValue" @update:model-value="(e) => update('display', e)" :rows="8" type="textarea" :autosize="{minRows:5, maxRows:15}"/>
        </el-form-item>
        <el-form-item label="Extends">
          <el-select :model-value="props.credential.extends ?? 'none'" @update:model-value="(e) => update('extends', e)">
            <el-option value="none" label="Select" />
            <el-option v-for="type in credentials" :key="type.id" :value="type.name" :label="type.name"/>
          </el-select>
        </el-form-item>
        <div class="statuslists">
            <label class="statuslists">Status Lists</label>
            <div class="statuslistblock">
                <MetadataStatusListEntry v-for="(sl, index) in statusLists" :key="index" :statuslist="sl" :show-add="index === statusLists.length - 1" @on-update="(e) => updateStatusList(index, e)" @on-remove="() => removeStatusList(index)" @on-add="addStatusList" />
                <div v-if="!statusLists.length" class="statuslistrow">
                    <el-button class='statuslist-add' type="primary" :icon="Plus" @click="addStatusList"/>
                </div>
            </div>
        </div>
        <hr/>
    </div>
</template>