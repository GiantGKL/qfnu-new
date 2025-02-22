<template>
  <div class="teacher-home-container">
    <h1>教师端主页</h1>
    <p>欢迎来到教师端主页！</p>
    <a-card title="课程管理" hoverable style="width: 50vw">
      <p>这里是课程管理功能。</p>
    </a-card>
    <a-card title="学生管理" hoverable style="width: 50vw">
      <p>这里是学生管理功能。</p>
    </a-card>
  </div>
</template>

<script setup>
import { Card } from 'ant-design-vue';
</script>

<style scoped>
.teacher-home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

a-card {
  margin-bottom: 20px;
}
</style> 