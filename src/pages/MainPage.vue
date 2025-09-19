<script setup lang="ts">
import { ref } from 'vue';

</script>
<template>
    <el-container class="main">
        <el-header></el-header>
        <el-container>
            <el-aside>
                <el-menu default-active="0" :router="true" class="el-menu-vertical-demo">
                    <el-menu-item index="/issuer">Issuer</el-menu-item>
                    <el-menu-item index="/verifier">Verifier</el-menu-item>
                    <el-menu-item index="/status">Status List</el-menu-item>
                </el-menu>                
            </el-aside>
            <el-main>
                <router-view />
            </el-main>
        </el-container>
        <el-footer>

        </el-footer>
    </el-container>
</template>