<script setup lang="ts">
import { list_presentations } from '@/api/presentations';
import { PresentationScheme } from '@/api/types';
import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import { useTokenStore } from '@/stores/token';
const identifiers:Ref<IdentifierScheme[]> = ref([]);
const store = useTokenStore();

onMounted(async () => {
    await refresh();
});
watch (() => store.agent, async () => { await refresh(); });

async function refresh()
{
    try {
        identifiers.value = await list_identifiers();
    }
    catch (e) {
        identifiers.value = [];
    }
}

const identifierDialog = ref(false);
const identifier:Ref<IdentifierScheme> = ref({
        did:'',
        alias: '',
        provider: '',
        saved: '',
        updated: '',
        keys: []
});
const originalDid = ref('');
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
    originalDid.value = '';
    identifierDialog.value=true;
}

function select(i:IdentifierScheme)
{
    identifier.value = i;
    originalDid.value = i.did;
    identifierDialog.value=true;
}

function onUpdateIdentifier(field:FieldValue)
{
    console.log('updating ', field);
    switch(field.field) {
        case 'did': {
            if (identifier.value.provider !== 'did:web') {
                alert('Changing did only allowed for did:web');
            }
            else {
                identifier.value.did = field.value;
            }
            break;
        }
        case 'keytype': keytype.value = field.value; break;
        case 'provider': identifier.value.provider = field.value; break;
        case 'alias': identifier.value.alias = field.value; break;
    }
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

import IdentifierDialog from '../../../dialogs/IdentifierDialog.vue';
import { FieldValue } from '@/types';
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
                <tr v-for="identifier in identifiers" :key="identifier.did" @dblclick="() => select(identifier)">
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
            <el-button @click="refresh">Refresh</el-button>
        </div>
        <IdentifierDialog :visible="identifierDialog" @on-close="onCloseIdentifier" @on-save="onSaveIdentifier" @on-update="onUpdateIdentifier" :identifier="identifier" :keytype="keytype" :original="originalDid"/>
    </div>
</template>