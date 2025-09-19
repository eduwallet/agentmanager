<script lang="ts" setup>
import { useTokenStore } from '@/stores/token';
import { ref, watch, onMounted } from 'vue';

const props = defineProps<{
    visible:boolean;
    module:string;
    name:string;
    url:string;
    token:string;
}>();
const emits = defineEmits(['onClose', 'onRemove']);
const name = ref('');
const url = ref('');
const token = ref('');

watch(() => props.visible, () => {
  console.log('visible prop changed in preset dialog');
  name.value = props.name;
  url.value = props.url;
  token.value = props.token;
});

onMounted(() => { console.log('onmounted presetdialog')});

const store = useTokenStore();

function remove()
{
    emits('onRemove');
    emits('onClose');
}

function closeForm()
{
    emits('onClose');
}

async function save()
{
    const data = {
        token: token.value,
        agent: name.value,
        url: url.value
    };
    console.log('saving ', data)
    if (props.name !== '' && props.name !== name.value) {
      store.remove(props.module, props.name);
    }
    store.update(props.module, name.value, data);
    emits('onClose');
}

</script>
<template>
    <el-dialog :model-value="props.visible" title="Edit Preset" :close-on-click-modal="false" :before-close="(done:any) => { closeForm(); done(false); }">
        <el-form>
        <el-form-item label="Name">
          <el-input v-model="name"/>
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="url"/>
        </el-form-item>
        <el-form-item label="Token">
          <el-input v-model="token"/>
        </el-form-item>
    </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="warning" @click="remove">Remove</el-button>
          <el-button type="primary" @click="save">Save</el-button>
        </span>
      </template>
    </el-dialog>
</template>
