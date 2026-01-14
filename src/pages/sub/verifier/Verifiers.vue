<script setup lang="ts">
import { list_verifiers } from '@/api/verifiers';
import { VerifierScheme } from '@/api/types';
import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import { useTokenStore } from '@/stores/token';
const verifiers:Ref<VerifierScheme[]> = ref([]);
const store = useTokenStore();

onMounted(async () => {
    await refresh();
});
watch (() => store.agent, async () => { await refresh(); });

async function refresh()
{
    try {
        verifiers.value = await list_verifiers();
    }
    catch (e) {
        console.log(e);
        verifiers.value = [];
    }
}

const dialog = ref(false);
const verifier:Ref<VerifierScheme> = ref({
        id:-1,
        name: '',
        path: '',
        did: '',
        admin_token: '',
        presentations: '[]',
        metadata: '{}',
        saved: '',
        updated: '',
});

function add()
{
    verifier.value = {
        id:-1,
        name: '',
        path: '',
        did: '',
        admin_token: '',
        presentations: '[]',
        metadata: '{}',
        saved: '',
        updated: '',
    };
    dialog.value=true;
}

function select(i:VerifierScheme)
{
    verifier.value = i;
    dialog.value=true;
}

function update(field:FieldValue)
{
    switch(field.field) {
        case 'name': verifier.value.name = field.value; break;
        case 'path': verifier.value.path = field.value; break;
        case 'did': verifier.value.did = field.value; break;
        case 'admin_token': verifier.value.admin_token = field.value; break;
        case 'presentations': verifier.value.presentations = field.value; break;
        case 'metadata': verifier.value.metadata = field.value; break;
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

import VerifierDialog from '../../../dialogs/VerifierDialog.vue';
import { FieldValue } from '@/types';
</script>
<template>
    <div>
        <h2>Verifier List</h2>
        <table class="listing">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Path</th>
                    <th>DID</th>
                    <th>Saved</th>
                    <th>Updated</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="p in verifiers" :key="p.id" @dblclick="() => select(p)">
                    <td>{{p.id}}</td>
                    <td>{{p.name}}</td>
                    <td>{{p.path}}</td>
                    <td>{{p.did}}</td>
                    <td>{{p.saved}}</td>
                    <td>{{p.updated}}</td>
                </tr>
            </tbody>
        </table>
        <div class="actions">
            <el-button @click="add">Add</el-button>
            <el-button @click="refresh">Refresh</el-button>
        </div>
        <VerifierDialog :visible="dialog" @on-close="close" @on-save="save" @on-update="update" :verifier="verifier"/>
    </div>
</template>