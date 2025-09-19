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

function add()
{
    const data = {
        token: token.value,
        agent: agent.value,
        url: url.value
    };
    store.update("issuer", agent.value, data);
    allLabels.value = store.allAgents("issuer");
}

function remove()
{
    store.remove("issuer", agent.value);
    allLabels.value = store.allAgents("issuer");
}

const selectedPreset = ref('');
function selectPreset()
{
    store.load("issuer", agent.value);
    token.value = store.token;
    url.value = store.url;
    agent.value = store.agent;
}

</script>
<template>
    <el-form label-position="left" label-width="auto">
        <el-form-item label="Presets">
            <el-select @change="selectPreset" v-model="selectedPreset">
                <el-option v-for="item in allLabels" :key="item" :value="item">{{ item }}</el-option>
            </el-select>
        </el-form-item>
        <el-collapse>
            <el-collapse-item title="Details">
                <el-form-item label="Name">
                    <el-input v-model="agent" type="text"/>
                </el-form-item>
                <el-form-item label="URL">
                    <el-input v-model="url" type="text"/>
                </el-form-item>
                <el-form-item label="Token">
                    <el-input v-model="token" type="text"/>
                </el-form-item>
                <el-form-item>
                    <el-button @click="add">Store</el-button>
                    <el-button @click="remove">Remove</el-button>
                </el-form-item>
            </el-collapse-item>
        </el-collapse>
        <el-form-item label="Actions">
            <router-link to="/issuer/identifiers">Identifiers</router-link>
        </el-form-item>
        <router-view />
    </el-form>    
</template>