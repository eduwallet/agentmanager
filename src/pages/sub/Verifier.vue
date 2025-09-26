<script setup lang="ts">
import { useTokenStore } from '@/stores/token';
import { ref, onMounted } from 'vue';
const token = ref('');
const url = ref('');
const agent = ref('');
const allLabels = ref<string[]>([]);
const store = useTokenStore();

onMounted(() => {
    allLabels.value = store.allAgents("verifier");
});

const visible = ref(false);
function add()
{
    agent.value = '';
    token.value = '';
    url.value = '';
    visible.value = true;
}
function edit()
{
    visible.value = true;
}

function onClose() {
    allLabels.value = store.allAgents("verifier");
    visible.value = false;
}

function onRemove()
{
    store.remove("verifier", agent.value);
}

const selectedPreset = ref('');
function selectPreset()
{
    store.load("verifier", selectedPreset.value);
    token.value = store.token;
    url.value = store.url;
    agent.value = store.agent;
}

async function quit()
{
    await process_exit();
}

import PresetDialog from '@/dialogs/PresetDialog.vue';
import { process_exit } from '@/api/admin';
</script>
<template>
    <el-form label-position="left" label-width="auto">
        <el-form-item label="Presets">
            <el-select @change="selectPreset" v-model="selectedPreset">
                <el-option v-for="item in allLabels" :key="item" :value="item">{{ item }}</el-option>
            </el-select>
            <el-button @click="add">Add</el-button>
            <el-button @click="edit">Edit</el-button>
        </el-form-item>
        <el-form-item class='actions' label="Actions">
            <router-link to="/verifier/identifiers">Identifiers</router-link>
        </el-form-item>
        <el-button @click="quit">Exit server</el-button>
        <router-view />
        <PresetDialog module="verifier" :visible="visible" :name="agent" :url="url" :token="token" @on-close="onClose" @on-remove="onRemove" />
    </el-form>    
</template>