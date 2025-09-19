<script lang="ts" setup>
import { delete_identifier, save_identifier } from '@/api/identifiers';
import { IdentifierScheme } from '@/api/types';

const props = defineProps<{
    visible:boolean;
    identifier:IdentifierScheme;
    keytype:string;
    original:string;
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

async function remove()
{
    await delete_identifier(props.identifier);
    console.log('emitting on close');
    emits('onSave');
}

async function submitForm()
{
    await save_identifier({
        did: props.identifier.did,
        alias: props.identifier.alias,
        provider: props.identifier.provider,
        keytype: props.keytype,
        original: props.original
    });
    emits('onSave');
}

const providers = ["did:web", "did:key", "did:jwk"];
const types = ["Secp256r1", "Secp256k1", "Ed25519", "RSA"];

</script>
<template>
    <el-dialog :model-value="props.visible" title="Edit Identifier" :close-on-click-modal="false"  :before-close="(done:any) => { closeForm(); done(false); }">
        <el-form>
        <el-form-item label="DID">
          <el-input :model-value="props.identifier.did" @update:model-value="(e) => update('did', e)" v-if="props.identifier.provider === 'did:web'"/>
          <div class="el-form-item__content" v-if="props.identifier.provider !== 'did:web'">{{ props.identifier.did }}</div>
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
          <el-button type="warning" @click="remove">Delete</el-button>
          <el-button type="secondary" @click="closeForm">Cancel</el-button>
          <el-button type="primary" @click="submitForm">Save</el-button>
        </span>
      </template>        
    </el-dialog>
</template>