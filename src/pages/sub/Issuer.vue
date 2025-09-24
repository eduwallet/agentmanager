<script setup lang="ts">
import { useTokenStore } from '@/stores/token';
import { ref, onMounted } from 'vue';
const token = ref('');
const url = ref('');
const agent = ref('');
const allLabels = ref<string[]>([]);
const store = useTokenStore();

onMounted(() => {
    allLabels.value = store.allAgents("issuer");
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
    console.log('clicked edit for ', agent.value);
    visible.value = true;
}

function onClose() {
    allLabels.value = store.allAgents("issuer");
    visible.value = false;
}

function onRemove()
{
    store.remove("issuer", agent.value);
}

const selectedPreset = ref('');
function selectPreset()
{
    console.log('selecting preset', selectedPreset.value);
    store.load("issuer", selectedPreset.value);
    token.value = store.token;
    url.value = store.url;
    agent.value = store.agent;
}

import PresetDialog from '@/dialogs/PresetDialog.vue';
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
            <router-link to="/issuer/credentials">Credentials</router-link>
            <router-link to="/issuer/identifiers">Identifiers</router-link>
            <router-link to="/issuer/issuers">Issuers</router-link>
        </el-form-item>
        <router-view />
        <PresetDialog module="issuer" :visible="visible" :name="agent" :url="url" :token="token" @on-close="onClose" @on-remove="onRemove" />
    </el-form>    
</template>