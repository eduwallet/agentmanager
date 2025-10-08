<script setup lang="ts">
import { list_configurations } from '@/api/configurations';
import { StatusListScheme } from '@/api/types';
import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import { useTokenStore } from '@/stores/token';
const configurations:Ref<StatusListScheme[]> = ref([]);
const store = useTokenStore();

onMounted(async () => {
    await refresh();
});
watch (() => store.agent, async () => { await refresh(); });

async function refresh()
{
    try {
        configurations.value = await list_configurations();
    }
    catch (e) {
        console.log(e);
        configurations.value = [];
    }
}

const dialog = ref(false);
const configuration:Ref<StatusListScheme> = ref({
        id:-1,
        name: '',
        purpose: 'revocation',
        type: 'statuslist+jwt',
        size: 131072,
        bitsize: 1,
        tokens: '[]',
        saved: '',
        updated: ''
});

function add()
{
    configuration.value = {
        id:-1,
        name: '',
        purpose: 'revocation',
        type: 'statuslist+jwt',
        size: 131072,
        bitsize: 1,
        tokens: '[]'
    };
    dialog.value=true;
}

function select(i:StatusListScheme)
{
    configuration.value = i;
    dialog.value=true;
}

function update(field:FieldValue)
{
    switch(field.field) {
        case 'name': configuration.value.name = field.value; break;
        case 'purpose': configuration.value.purpose = field.value; break;
        case 'type': configuration.value.type = field.value; break;
        case 'size': configuration.value.size = parseInt(field.value); break;
        case 'bitsize': configuration.value.bitsize = parseInt(field.value); break;
        case 'tokens': configuration.value.tokens = JSON.stringify(field.value.split(',').map((e) => e.trim())); break;
        case 'messages': configuration.value.messagesString = field.value; break;
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

import { FieldValue } from '@/types';
import ConfigurationDialog from '../../../dialogs/ConfigurationDialog.vue';
</script>
<template>
    <div>
        <h2>Status List Configuration List</h2>
        <table class="listing">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Purpose</th>
                    <th>Size</th>
                    <th>Bitsize</th>
                    <th>Saved</th>
                    <th>Updated</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="p in configurations" :key="p.id" @dblclick="() => select(p)">
                    <td>{{p.id}}</td>
                    <td>{{p.name}}</td>
                    <td>{{p.type}}</td>
                    <td>{{p.purpose}}</td>
                    <td>{{p.size}}</td>
                    <td>{{p.bitsize}}</td>
                    <td>{{p.saved}}</td>
                    <td>{{p.updated}}</td>
                </tr>
            </tbody>
        </table>
        <div class="actions">
            <el-button @click="add">Add</el-button>
            <el-button @click="refresh">Refresh</el-button>
        </div>
        <ConfigurationDialog :visible="dialog" @on-close="close" @on-save="save" @on-update="update" :configuration="configuration"/>
    </div>
</template>