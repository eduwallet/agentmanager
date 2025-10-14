<script lang="ts" setup>
import { computed, toRaw } from 'vue';
import { IssuerScheme } from '@/api/types';

const props = defineProps<{
    visible:boolean;
    issuer:IssuerScheme;
}>();
const emits = defineEmits(['onClose', 'onUpdate', 'onSave']);

function closeForm()
{
    emits('onClose');
}

const credentials = computed(() => {
    return Object.keys(props.issuer.statusLists ?? {});
})

function addCred()
{
    const statlists = Object.assign({}, props.issuer.statusLists);
    statlists['New'] = [{url:'',revoke:'',token:''}];
    emits('onUpdate', statlists);
}

function update(index:number, key:string, field:FieldValue)
{
    const statlists = JSON.parse(JSON.stringify(props.issuer.statusLists ?? {}));
    const keys = Object.keys(statlists);
    if (index < 0 || index >= keys.length) {
        return;
    }

    const indexkey = keys[index];
    if (indexkey !== key) {
        return;
    }

    if (field.field == 'credential') {
        if (field.value !== '') {
            statlists[field.value] = structuredClone(statlists[indexkey]);
        }
        delete statlists[indexkey];
        emits('onUpdate', statlists);
    }
    else {
        if (typeof(field.index) == undefined || field.index! < 0 || field.index! >= statlists[indexkey].length) {
            return;
        }
        switch (field.field) {
            case 'url':
            case 'revoke':
            case 'token':
                statlists[indexkey][field.index!][field.field] = field.value;

                if (field.field == 'url' && field.value == '') {
                    statlists[indexkey].splice(field.index!, 1);
                }
                break;
            case 'add':
                statlists[indexkey].push({url:'', token:'', revoke:''});
                break;
        }
        emits('onUpdate', statlists);
    }
}

function getIssuerStatusList(key:string)
{
    const retval = props.issuer.statusLists[key] ?? [];
    if (!Array.isArray(retval)) {
        return [retval];
    }
    return retval;
}

import StatusCredentialEntry from './components/StatusCredentialEntry.vue';
import { FieldValue } from '@/types';
</script>
<template>
    <el-dialog :model-value="props.visible" title="Edit Status Lists" :close-on-click-modal="false"  :before-close="(done:any) => { closeForm(); done(false); }">
      <el-form>
        <StatusCredentialEntry v-for="(key, index) in credentials" :key="index" :credential="key" :statuslists="getIssuerStatusList(key)" @on-update="(e) => update(index, key, e)"/>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button type="success" @click="addCred">Add</el-button>
            <el-button type="primary" @click="closeForm">Close</el-button>
        </span>
      </template>        
    </el-dialog>
</template>