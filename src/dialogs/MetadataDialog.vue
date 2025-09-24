<script lang="ts" setup>
import { computed } from 'vue';
import { IssuerScheme } from '@/api/types';

const props = defineProps<{
    visible:boolean;
    issuer:IssuerScheme;
}>();
const emits = defineEmits(['onClose', 'onUpdate', 'onSave']);

function closeForm()
{
    emits('onClose');
}

const credentials = computed(() => {
    return Object.keys(props.issuer.statusLists ?? {});
})

function update(field:string, value:any, index:number = -1)
{
    const metadata = JSON.parse(JSON.stringify(props.issuer.metadata));
    switch (field) {
        case 'authorization_servers':
            metadata[field] = value;
            break;
        case 'batchsize':
            const size = parseInt(value);
            if (isNaN(size)) {
                delete metadata.batch_credential_issuance;
            }
            else {
                metadata['batch_credential_issuance'] = {batch_size: parseInt(value)};
            }
            break;
        case 'display':
            if (index < 0) return;
            if (!metadata.display) {
                metadata.display = [];
                index = 0;
            }
            else {
                if (value.name === '') {
                    metadata.display.splice(index, 1);
                }
                else {
                    metadata.display[index] = value;
                }
            }
            break;
        case 'credential': {
            if (!metadata.credential_configurations_supported[value.original]) {
                return;
            }
            const newvalue = JSON.parse(JSON.stringify(value));
            console.log('new credential value', newvalue);
            if (newvalue.original) delete newvalue.original;
            if (newvalue.name) delete newvalue.name;

            if (value.original != value.name) {
                console.log('original does not match name, so deleting old entry ', value.original);
                delete metadata.credential_configurations_supported[value.original];
            }
            if (value.name !== '') {
                console.log('storing credential under ', value.name);
                metadata.credential_configurations_supported[value.name] = newvalue;
            }
            break;
        }
    }
    emits('onUpdate', metadata);
}

function addDisplay()
{
    const metadata = JSON.parse(JSON.stringify(props.issuer.metadata));
    if (!metadata.display) {
        metadata.display = [];
    }
    metadata.display.push({});
    emits('onUpdate', metadata);
}

function addCredential()
{
    const metadata = JSON.parse(JSON.stringify(props.issuer.metadata));
    if (!metadata.credential_configurations_supported) {
        metadata.credential_configurations_supported = {};
    }
    metadata.credential_configurations_supported['NewCredential'] = {};
    emits('onUpdate', metadata);
}

const credentialIds = computed(() => Object.keys(props.issuer.metadata.credential_configurations_supported));

import MetadataDisplay from './components/MetadataDisplay.vue';
import MetadataCredentials from './components/MetadataCredentials.vue';
import { Plus } from '@element-plus/icons-vue';
</script>
<template>
    <el-dialog :model-value="props.visible" title="Edit Metadata" :close-on-click-modal="false"  :before-close="(done:any) => { closeForm(); done(false); }">
      <el-form>
        <el-form-item label="Auth Servers">
          <el-input :model-value="props.issuer.metadata.authorization_servers" @update:model-value="(e) => update('authorization_servers', e)"/>
        </el-form-item>
        <el-form-item label="Batch size">
          <el-input :model-value="props.issuer.metadata.batch_credential_issuance?.batch_size" @update:model-value="(e) => update('batchsize', e)"/>
        </el-form-item>
        <div class="display">
            <label class="display">Display</label>
            <MetadataDisplay v-for="(key, index) in props.issuer.metadata.display" :key="index" :display="key" @on-update="(e) => update('display', e, index)" />
            <el-button class='addicon' type="primary" :icon="Plus" @click="addDisplay"/>
        </div>
        <div class="credentials">
            <label class="display">Credentials</label>
            <MetadataCredentials v-for="(key, index) in credentialIds" :key="index" :name="key" :credential="props.issuer.metadata.credential_configurations_supported[key]" @on-update="(e) => update('credential', e)" />
            <el-button class='addicon' type="primary" :icon="Plus" @click="addCredential"/>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button type="primary" @click="closeForm">Close</el-button>
        </span>
      </template>        
    </el-dialog>
</template>