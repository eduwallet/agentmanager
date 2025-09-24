<script lang="ts" setup>
import { FieldValue, MetadataDisplay } from '@/types';

const props = defineProps<{
    display:MetadataDisplay;
}>();
const emits = defineEmits(['onUpdate']);

function update(fieldName:string, value: any)
{
    const display = JSON.parse(JSON.stringify(props.display));
    switch(fieldName) {
        case 'name':
        case 'description':
        case 'locale':
            display[fieldName] = value;
            break;
        case 'logo':
            if (!display.logo) {
                display.logo = {};
            }
            display.logo.uri = value;
            break;
        case 'alt':
            if (!display.logo) {
                display.logo = {};
            }
            display.logo.alt_text = value;
            break;
    }

    emits('onUpdate', display);
}

</script>
<template>
    <div class="metadatadisplay">
        <el-form-item label="Locale">
          <el-input :model-value="props.display.locale" @update:model-value="(e) => update('locale', e)"/>
        </el-form-item>
        <el-form-item label="Name">
          <el-input :model-value="props.display.name" @update:model-value="(e) => update('name', e)"/>
        </el-form-item>
        <el-form-item label="Description">
          <el-input :model-value="props.display.description" @update:model-value="(e) => update('description', e)"/>
        </el-form-item>
        <el-form-item label="Logo">
          <el-input :model-value="props.display.logo?.uri" @update:model-value="(e) => update('logo', e)"/>
        </el-form-item>
        <el-form-item label="Alt Text">
          <el-input :model-value="props.display.logo?.alt_text" @update:model-value="(e) => update('alt', e)"/>
        </el-form-item>
        <hr/>
    </div>
</template>