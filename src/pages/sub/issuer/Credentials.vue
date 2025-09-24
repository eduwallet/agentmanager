<script setup lang="ts">
import { list_credentials } from '@/api/credentials';
import { CredentialScheme } from '@/api/types';
import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import { useTokenStore } from '@/stores/token';
const data:Ref<CredentialScheme[]> = ref([]);
const store = useTokenStore();

onMounted(async () => {
    await refresh();
});
watch (() => store.agent, async () => { await refresh(); });

async function refresh()
{
    try {
        data.value = await list_credentials();
    }
    catch (e) {
        data.value = [];
    }
}

const dialog = ref(false);
const credential:Ref<CredentialScheme> = ref({
        name:'',
        configuration: {},
        configurationString: '{}'
});

function add()
{
    credential.value = {
        name:'',
        configuration: {},
        configurationString: '{}'
    }
    dialog.value=true;
}

function select(i:CredentialScheme)
{
    credential.value = i;
    credential.value.configurationString = JSON.stringify(credential.value.configuration, null, 2);
    dialog.value=true;
}

function update(field:FieldValue)
{
    switch(field.field) {
        case 'name': credential.value.name = field.value; break;
        case 'configuration':
            credential.value.configurationString = field.value;
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
    await refresh();
}

import CredentialDialog from '../../../dialogs/CredentialDialog.vue';
import { FieldValue } from '@/types';
</script>
<template>
    <div>
        <h2>Credential List</h2>
        <table class="listing">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Saved</th>
                    <th>Updated</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="cred in data" :key="cred.id" @dblclick="() => select(cred)">
                    <td>{{cred.id}}</td>
                    <td>{{cred.name}}</td>
                    <td>{{cred.saved}}</td>
                    <td>{{cred.updated}}</td>
                </tr>
            </tbody>
        </table>
        <div class="actions">
            <el-button @click="add">Add</el-button>
            <el-button @click="refresh">Refresh</el-button>
        </div>
        <CredentialDialog :visible="dialog" @on-close="close" @on-save="save" @on-update="update" :credential="credential"/>
    </div>
</template>