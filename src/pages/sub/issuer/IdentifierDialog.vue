<script lang="ts" setup>
import { save_identifier } from '@/api/identifiers';
import { IdentifierScheme } from '@/api/types';

const props = defineProps<{
    visible:boolean;
    identifier:IdentifierScheme;
    keytype:string;
}>();
const emits = defineEmits(['onClose', 'onUpdate', 'onSave']);

function update(fieldName:string, value: any)
{
    emits('onUpdate', {field: fieldName, value: value});
}

function closeForm()
{
    emits('onClose');
}

async function submitForm()
{
    await save_identifier(props.identifier)
        .then((i:IdentifierScheme) => {
            emits('onSave', i);
        })
}

const providers = ["did:web", "did:key", "did:jwk"];
const types = ["Secp256r1", "Secp256k1", "Ed25519", "RSA"];

</script>
<template>
    <el-dialog :model-value="props.visible" title="Edit Identifier" :close-on-click-modal="false"  :before-close="(done:any) => { closeForm(); done(false); }">
        <el-form>
        <el-form-item label="DID">
          <div class="el-form-item__content">{{ props.identifier.did }}</div>
        </el-form-item>
        <el-form-item label="Alias">
          <el-input :model-value="props.identifier.alias" @update:model-value="(e) => update('alias', e)"/>
        </el-form-item>
        <el-form-item label="Provider">
            <el-select :model-value="props.identifier.provider" @update:model-value="(e) => update('provider', e)">
                <el-option v-for="type in providers" :key="type" :value="type" :label="type"/>
            </el-select>
        </el-form-item>
        <el-form-item label="Type" v-if="props.identifier.did === ''">
            <el-select :model-value="props.keytype" @update:model-value="(e) => update('keytype', e)">
                <el-option v-for="type in types" :key="type" :value="type" :label="type"/>
            </el-select>
        </el-form-item>
    </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="warning" @click="closeForm">Cancel</el-button>
          <el-button type="primary" @click="submitForm">Save</el-button>
        </span>
      </template>        
    </el-dialog>
</template>