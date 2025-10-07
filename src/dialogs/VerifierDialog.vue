<script lang="ts" setup>
import { delete_verifier, save_verifier} from '@/api/verifiers';
import {  PresentationScheme, VerifierScheme } from '@/api/types';
import { computed, ref,  Ref, watch } from 'vue';
import { list_presentations } from '@/api/presentations';

const props = defineProps<{
    visible:boolean;
    verifier:VerifierScheme;
}>();
const emits = defineEmits(['onClose', 'onUpdate', 'onSave']);
const presentations:Ref<PresentationScheme[]> = ref([]);

watch(() => props.visible,
  async () => {
    presentations.value = await list_presentations();
  }
);

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
    await delete_verifier(props.verifier);
    emits('onSave');
}

async function submit()
{
    await save_verifier({
        id: props.verifier.id,
        name: props.verifier.name,
        path: props.verifier.path,
        did: props.verifier.did,
        admin_token: props.verifier.admin_token,
        presentations: props.verifier.presentations
    });
    emits('onSave');
}

const chosenPres = computed(() => {
    const lst = JSON.stringify(props.verifier.presentations);
    const ids = presentations.value.filter((p) => lst.includes(p.shortname)).map((p) => p.id);
    return ids;
})

function updatePresentations(e)
{
    // e is the new value list, but we need to transform this to labels for our representation
    const lst:string[] = [];
    for (const p of presentations.value) {
      if (e.includes(p.id)) {
        lst.push(p.shortname);
      }
    }
    emits('onUpdate', {field:'presentations', value: lst});
}

</script>
<template>
    <el-dialog :model-value="props.visible" title="Edit Verifier" :close-on-click-modal="false"  :before-close="(done:any) => { close(); done(false); }">
        <el-form>
        <el-form-item label="Name">
          <el-input :model-value="props.verifier.name" @update:model-value="(e) => update('name', e)"/>
        </el-form-item>
        <el-form-item label="Path">
          <el-input :model-value="props.verifier.path" @update:model-value="(e) => update('path', e)"/>
        </el-form-item>
        <el-form-item label="Token">
          <el-input :model-value="props.verifier.admin_token" @update:model-value="(e) => update('admin_token', e)"/>
        </el-form-item>
        <el-form-item label="DID">
          <el-input :model-value="props.verifier.did" @update:model-value="(e) => update('did', e)"/>
        </el-form-item>
        <el-form-item label="Presentations">
            <el-select :model-value="chosenPres" @update:model-value="(e) => updatePresentations(e)" multiple>
                <el-option value="0" label="Select" />
                <el-option v-for="p in presentations" :key="p.id" :value="p.id" :label="p.shortname"/>
            </el-select>
        </el-form-item>
    </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="remove" v-if="(props.verifier.id ?? 0) > 0">Delete</el-button>
          <el-button type="warning" @click="close">Cancel</el-button>
          <el-button type="primary" @click="submit">Save</el-button>
        </span>
      </template>        
    </el-dialog>
</template>