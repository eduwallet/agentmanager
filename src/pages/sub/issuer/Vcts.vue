<script setup lang="ts">
import { list_vcts } from '@/api/vcts';
import { VCTScheme } from '@/api/types';
import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import { useTokenStore } from '@/stores/token';
const data:Ref<VCTScheme[]> = ref([]);
const store = useTokenStore();

onMounted(async () => {
    await refresh();
});
watch (() => store.agent, async () => { await refresh(); });

async function refresh()
{
    try {
        data.value = await list_vcts();
    }
    catch (e) {
        data.value = [];
    }
}

const dialog = ref(false);
const ctx:Ref<VCTScheme> = ref({
        name:'',
        path:'',
        credentials: [],
        credentialsString: '[]',
        document: {},
        documentString: '{}'
});

function add()
{
    ctx.value = {
        name:'',
        path:'',
        credentials: [],
        credentialsString: '[]',
        document: {},
        documentString: '{}'
    }
    dialog.value=true;
}

function select(i:VCTScheme)
{
    ctx.value = i;
    ctx.value.credentialsString = (ctx.value.credentials as string[]).join(',');
    ctx.value.documentString = JSON.stringify(ctx.value.document, null, 2);
    dialog.value=true;
}

function update(field:FieldValue)
{
    switch(field.field) {
        case 'path':
        case 'name': ctx.value[field.field] = field.value; break;
        case 'document':
            ctx.value.documentString = field.value;
            break;
        case 'credentials':
            ctx.value.credentialsString = field.value;
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

import VCTDialog from '../../../dialogs/VCTDialog.vue';
import { FieldValue } from '@/types';
</script>
<template>
    <div>
        <h2>VCT Document List</h2>
        <table class="listing">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Path</th>
                    <th>Credentials</th>
                    <th>Saved</th>
                    <th>Updated</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="obj in data" :key="obj.id" @dblclick="() => select(obj)">
                    <td>{{obj.id}}</td>
                    <td>{{obj.name}}</td>
                    <td>{{obj.path}}</td>
                    <td>{{ (obj.credentials as string[]).join(',') }}</td>
                    <td>{{obj.saved}}</td>
                    <td>{{obj.updated}}</td>
                </tr>
            </tbody>
        </table>
        <div class="actions">
            <el-button @click="add">Add</el-button>
            <el-button @click="refresh">Refresh</el-button>
        </div>
        <VCTDialog :visible="dialog" @on-close="close" @on-save="save" @on-update="update" :vct="ctx"/>
    </div>
</template>