<script setup lang="ts">
import { list_identifiers } from '@/api/identifiers';
import { IdentifierScheme } from '@/api/types';
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
const identifiers:Ref<IdentifierScheme[]> = ref([]);

onMounted(async () => {
    identifiers.value = await list_identifiers();
});

const identifierDialog = ref(false);
const identifier:Ref<IdentifierScheme> = ref({
        did:'',
        alias: '',
        provider: '',
        saved: '',
        updated: '',
        keys: []
});
const keytype = ref('Secp256r1');

function add()
{
    identifier.value = {
        did:'',
        alias: '',
        provider: 'did:jwk',
        saved: '',
        updated: '',
        keys: []
    }
    identifierDialog.value=true;
}

function onUpdateIdentifier(field:string, value:string)
{

}

function onCloseIdentifier()
{
    identifierDialog.value = false;
}

async function onSaveIdentifier()
{
    identifierDialog.value = false;
    identifiers.value = await list_identifiers();
}

import IdentifierDialog from './IdentifierDialog.vue';
</script>
<template>
    <div>
        <h2>Identifier List</h2>
        <table class="listing">
            <thead>
                <tr>
                    <th>DID</th>
                    <th>Alias</th>
                    <th>Provider</th>
                    <th>Keys</th>
                    <th>Saved</th>
                    <th>Updated</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="identifier in identifiers" :key="identifier.did">
                    <td>{{identifier.did}}</td>
                    <td>{{identifier.alias}}</td>
                    <td>{{identifier.provider}}</td>
                    <td>{{identifier.keys.length}}</td>
                    <td>{{identifier.saved}}</td>
                    <td>{{identifier.updated}}</td>
                </tr>
            </tbody>
        </table>
        <div class="actions">
            <el-button @click="add">Add</el-button>
        </div>
        <IdentifierDialog :visible="identifierDialog" @on-close="onCloseIdentifier" @on-save="onSaveIdentifier" @on-update="onUpdateIdentifier" :identifier="identifier" :keytype="keytype"/>
    </div>
</template>