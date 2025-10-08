<script lang="ts" setup>
import { delete_configuration, save_configuration} from '@/api/configurations';
import {  StatusListScheme } from '@/api/types';
import { computed, ref,  Ref, watch } from 'vue';

const props = defineProps<{
    visible:boolean;
    configuration:StatusListScheme;
}>();
const emits = defineEmits(['onClose', 'onUpdate', 'onSave']);

function update(fieldName:string, value: any)
{
    emits('onUpdate', {field: fieldName, value: value});
}

function close()
{
    emits('onClose');
}

async function remove()
{
    await delete_configuration(props.configuration);
    emits('onSave');
}

async function submit()
{
    try {
        if (!props.configuration.messagesString || props.configuration.messagesString.trim() == '') {
            delete props.configuration.messages;
        }
        else {
            props.configuration.messages = JSON.stringify(JSON.parse(props.configuration.messagesString));
            if (!props.configuration.messages || props.configuration.messages == '{}') {
                delete props.configuration.messages;
            }
        }
    }
    catch (e) {
        alert("The messages entry must be either empty, or a correct JSON document");
        return;
    }

    await save_configuration({
        id: props.configuration.id,
        name: props.configuration.name,
        purpose: props.configuration.purpose,
        type: props.configuration.type,
        size: props.configuration.size,
        bitsize: props.configuration.bitsize,
        tokens: props.configuration.tokens,
        ...(props.configuration.messages && {messages: props.configuration.messages})
    });
    emits('onSave');
}

const tokenString = computed(() => {
    if (!props.configuration.tokens) {
        return '';
    }
    try {
        const tokens = JSON.parse(props.configuration.tokens);
        return tokens.join(', ');
    }
    catch (e) {
        return props.configuration.tokens;
    }
})

</script>
<template>
    <el-dialog :model-value="props.visible" title="Edit Statuslist Configuration" :close-on-click-modal="false"  :before-close="(done:any) => { close(); done(false); }">
        <el-form>
        <el-form-item label="Name">
          <el-input :model-value="props.configuration.name" @update:model-value="(e) => update('name', e)"/>
        </el-form-item>
        <el-form-item label="Type">
            <el-select :model-value="props.configuration.type" @update:model-value="(e) => update('type', e)">
                <el-option value="BitstringStatusList" label="BitstringStatusList" />
                <el-option value="StatusList2020" label="StatusList2020" />
                <el-option value="StatusList2021" label="StatusList2021" />
                <el-option value="RevocationList2020Status" label="RevocationList2020Status" />
                <el-option value="RevocationList2021Status" label="RevocationList2021Status" />
                <el-option value="SuspensionList202Status" label="SuspensionList2020Status" />
                <el-option value="SuspensionList2021Status" label="SuspensionList2021Status" />
                <el-option value="statuslist+jwt" label="IETF Token Status List" />
            </el-select>
        </el-form-item>
        <el-form-item label="Purpose">
          <el-input :model-value="props.configuration.purpose" @update:model-value="(e) => update('purpose', e)"/>
          <i>Any value, but reserved values are refresh, revocation, suspension, message</i>
        </el-form-item>
        <el-form-item label="Size">
          <el-input :model-value="props.configuration.size" @update:model-value="(e) => update('size', e)"/>
            <i>Indicated default is 131072</i>
        </el-form-item>
        <el-form-item label="Bitsize">
            <el-select :model-value="props.configuration.bitsize" @update:model-value="(e) => update('bitsize', e)">
                <el-option value="1" label="1 bit" />
                <el-option value="2" label="2 bits" />
                <el-option value="3" label="3 bits" />
                <el-option value="4" label="4 bits" />
            </el-select>
            <i>Please note: not supported for StatusList2020/StatusList2021 and related types</i>
        </el-form-item>
        <el-form-item label="Tokens">
            <el-input :model-value="tokenString" @update:model-value="(e) => update('tokens', e)"/>
            <i>Comma separated list of tokens that are allowed administrative access</i>
        </el-form-item>
        <el-form-item label="Messages" v-if="props.configuration.type == 'BitstringStatusList'">
            <el-input :model-value="props.configuration.messagesString" @update:model-value="(e) => update('messages', e)" :rows="8" type="textarea" :autosize="{minRows:5, maxRows:15}"/>
            <i>A json document containing an array of message objects, each object containing status (hexadecimal message value) and message (message meaning)</i>
        </el-form-item>
    </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="remove" v-if="(props.configuration.id ?? 0) > 0">Delete</el-button>
          <el-button type="warning" @click="close">Cancel</el-button>
          <el-button type="primary" @click="submit">Save</el-button>
        </span>
      </template>        
    </el-dialog>
</template>