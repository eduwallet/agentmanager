<script setup lang="ts">
import { get_issuer, list_issuers } from '@/api/issuers';
import { IssuerScheme } from '@/api/types';
import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import { useTokenStore } from '@/stores/token';
const issuers:Ref<IssuerScheme[]> = ref([]);
const store = useTokenStore();

onMounted(async () => {
    await refresh();
});
watch (() => store.agent, async () => { await refresh(); });

async function refresh()
{
    try {
        issuers.value = await list_issuers();
    }
    catch (e) {
        issuers.value = [];
    }
}

const dialog = ref(false);
const issuer:Ref<IssuerScheme> = ref({
    id: -1,
    name: '',
    did:'',
    baseUrl: '',
    adminToken: '',
    authorizationEndpoint: '',
    tokenEndpoint: '',
    clientId: '',
    clientSecret: '',
    metadata: {},
    statusLists: {}
});

function add()
{
    issuer.value = {
        id: -1,
        name: '',
        did:'',
        baseUrl: '',
        adminToken: '',
        authorizationEndpoint: '',
        tokenEndpoint: '',
        clientId: '',
        clientSecret: '',
        metadata: {},
        statusLists: {}
    }
    dialog.value=true;
}

async function select(i:IssuerScheme)
{
    issuer.value = await get_issuer(i);
    dialog.value=true;
}

function update(field:FieldValue)
{
    switch(field.field) {
        case 'name':
        case 'baseUrl':
        case 'adminToken':
        case 'authorizationEndpoint':
        case 'tokenEndpoint':
        case 'clientId':
        case 'clientSecret':
        case 'did': 
        case 'metadata':
        case 'statusLists':
            issuer.value[field.field] = field.value; 
            break;
    }
}

function close()
{
    dialog.value = false;
}

async function save()
{
    dialog.value = false;
    issuers.value = await list_issuers();
}

import IssuerDialog from '../../../dialogs/IssuerDialog.vue';
import { FieldValue } from '@/types';
</script>
<template>
    <div>
        <h2>Issuer List</h2>
        <table class="listing">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>DID</th>
                    <th>baseURL</th>
                    <th>Saved</th>
                    <th>Updated</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="obj in issuers" :key="obj.id" @dblclick="() => select(obj)">
                    <td>{{obj.id}}</td>
                    <td>{{obj.name}}</td>
                    <td>{{obj.did}}</td>
                    <td>{{obj.baseUrl}}</td>
                    <td>{{obj.saved}}</td>
                    <td>{{obj.updated}}</td>
                </tr>
            </tbody>
        </table>
        <div class="actions">
            <el-button @click="add">Add</el-button>
            <el-button @click="refresh">Refresh</el-button>
        </div>
        <IssuerDialog :visible="dialog" @on-close="close" @on-save="save" @on-update="update" :issuer="issuer"/>
    </div>
</template>