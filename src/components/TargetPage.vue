<template>
  <a-input-search
  v-model:value="value"
  placeholder="搜索目标"
  enter-button
  @search="onSearch"
  />
  <a-card style="width: 100vw" hoverable>
    <a-button type="primary" @click="showDrawer">Open</a-button>
    <a-drawer
    v-model:open="open"
    class="custom-class"
    root-class-name="root-class-name"
    :root-style="{ color: 'blue' }"
    style="color: red"
    title="Basic Drawer"
    placement="right"
    @after-open-change="afterOpenChange"
  >
    <p>箫癫笙</p>
    <p>窝药水窖乐</p>
  </a-drawer>
  </a-card>
</template>
<script setup>
import { ref } from 'vue';
const open = ref(false);
const afterOpenChange = bool => {
  console.log('open', bool);
};
const showDrawer = () => {
  open.value = true;
};
</script>