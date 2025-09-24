<script lang="ts" setup>
import { list_credentials } from '@/api/credentials';
import { CredentialScheme } from '@/api/types';
import { MetadataCredential } from '@/types';
import { computed, onMounted, ref } from 'vue';
import type { Ref } from 'vue';

const props = defineProps<{
    name:string;
    credential:MetadataCredential;
}>();
const emits = defineEmits(['onUpdate']);

const credentials:Ref<CredentialScheme[]> = ref([]);
onMounted(async () => {
  credentials.value = await list_credentials();
})

function update(fieldName:string, value: any)
{
    const md = JSON.parse(JSON.stringify(props.credential));
    md.original = props.name;
    md.name = props.name;
    switch(fieldName) {
        case 'name':
        case 'format':
        case 'scope':
            md[fieldName] = value;
            break;
        case 'extends':
            if (value == 'none') {
              delete md[fieldName];
            }
            else {
              md[fieldName] = value;
            }
            break;
        case 'display':
            md.display = JSON.parse(value);
            break;
    }

    emits('onUpdate', md);
}

const displayValue = computed(() => JSON.stringify(props.credential?.display ?? {}, null, 2));
</script>
<template>
    <div class="metadatadisplay">
        <el-form-item label="ID">
          <el-input :model-value="props.name" @update:model-value="(e) => update('name', e)"/>
        </el-form-item>
        <el-form-item label="Format">
          <el-input :model-value="props.credential.format" @update:model-value="(e) => update('format', e)"/>
        </el-form-item>
        <el-form-item label="Scope">
          <el-input :model-value="props.credential.scope" @update:model-value="(e) => update('scope', e)"/>
        </el-form-item>
        <el-form-item label="Display">
          <el-input :model-value="displayValue" @update:model-value="(e) => update('display', e)" :rows="8" type="textarea" :autosize="{minRows:5, maxRows:15}"/>
        </el-form-item>
        <el-form-item label="Extends">
          <el-select :model-value="props.credential.extends ?? 'none'" @update:model-value="(e) => update('extends', e)">
            <el-option value="none" label="Select" />
            <el-option v-for="type in credentials" :key="type.id" :value="type.name" :label="type.name"/>
          </el-select>
        </el-form-item>
        <hr/>
    </div>
</template>