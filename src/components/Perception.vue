/**
 * @author WangTianci
 * @version 1.0
 * @since 2024-12-20
 * @description 心得体会模块
 */
<template>
  <div class="body">
    <!-- 任务列表 -->
    <div v-if="showTaskList" class="task-list">
      <h2>任务列表</h2>
      <div v-for="task in tasks" :key="task.task_id" class="task">
        <h3>{{ task.task_name }}</h3>
        <p>发布时间: {{ task.publish_time }}</p>
        <p>截止时间: {{ task.deadline }}</p>
        <p>是否完成: {{ task.is_completed ? '是' : '否' }}</p>
        <button class="view-button" @click="viewTaskDetail(task.task_id)">查看详情</button>
      </div>
    </div>

    <!-- 任务详情 -->
    <div v-if="showTaskDetail" class="task-detail">
      <h2>{{ taskDetail.task_name }}</h2>
      <p>发布时间: {{ taskDetail.publish_time }}</p>
      <p>截止时间: {{ taskDetail.deadline }}</p>
      <p>是否完成: {{ taskDetail.is_completed ? '是' : '否' }}</p>
      <div class="entry-content">
        <textarea v-model="entryContent" placeholder="请输入心得体会" @paste.prevent></textarea>
      </div>
      <button class="submit-button" @click="submitEntry">提交</button>
      <div v-if="entries.length" class="entry-history">
        <h3>提交历史</h3>
        <ul>
          <li v-for="entry in entries" :key="entry.id">{{ entry.content }} - {{ entry.created_at }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const tasks = ref([]);
const showTaskList = ref(true);
const showTaskDetail = ref(false);
const taskDetail = ref({});
const entryContent = ref('');
const entries = ref([]);

// 获取任务列表
const fetchTasks = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/task');
    tasks.value = response.data.map(task => ({
      ...task,
      publish_time: new Date(task.publish_time).toLocaleString(),
      deadline: new Date(task.deadline).toLocaleString(),
    }));
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
  }
};

// 查看任务详情
const viewTaskDetail = async (taskId) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/task/${taskId}`);
    taskDetail.value = response.data;
    showTaskList.value = false;
    showTaskDetail.value = true;

    // 格式化日期
    taskDetail.value.publish_time = new Date(taskDetail.value.publish_time).toLocaleString();
    taskDetail.value.deadline = new Date(taskDetail.value.deadline).toLocaleString();

    // 将entryContent显示在输入框中
    entryContent.value = taskDetail.value.entryContent || '';
  } catch (error) {
    console.error('Failed to fetch task detail:', error);
  }
};

// 获取提交历史
const fetchEntries = async (taskId) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/task/${taskId}/entries`);
    entries.value = response.data;
  } catch (error) {
    console.error('Failed to fetch entries:', error);
  }
};

// 提交新的心得体会
const submitEntry = async () => {
  if (!entryContent.value.trim()) {
    alert('内容不能为空');
    return;
  }

  // 获取当前时间和截止时间
  const now = new Date();
  const deadline = new Date(taskDetail.value.deadline);

  // 检查当前时间是否超过截止时间
  if (now > deadline) {
    alert('无法提交，已超过截止时间');
    return;
  }

  try {
    const response = await axios.post(`http://localhost:3000/api/task/${taskDetail.value.task_id}/entry`, { content: entryContent.value });
    if (response.status === 201) {
      entryContent.value = '';
      alert('提交成功');
      showTaskList.value = true; // 返回任务列表
      showTaskDetail.value = false; // 隐藏任务详情
      fetchTasks(); // 更新任务列表
    } else {
      alert('提交失败');
    }
  } catch (error) {
    console.error('Failed to submit entry:', error);
    alert('提交失败');
  }
};

// 更新任务完成状态
const updateTaskCompletion = async (taskId) => {
  try {
    await axios.put(`http://localhost:3000/api/task/${taskId}/complete`);
    taskDetail.value.is_completed = true;
  } catch (error) {
    console.error('Failed to update task completion:', error);
  }
};

// 页面加载时获取任务列表
fetchTasks();
</script>

<style>
.body {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(to bottom, #f0f4f8, #d9e2ec);
  padding: 20px;
}

.task-list, .task-detail {
  width: 80%;
  max-width: 800px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.task {
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 0;
}

.task:last-child {
  border-bottom: none;
}

h2 {
  color: #333;
  margin-bottom: 10px;
}

p {
  color: #555;
  margin: 5px 0;
}

.view-button, .submit-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.view-button:hover, .submit-button:hover {
  background-color: #0056b3;
}

/* 输入框 */
.entry-content textarea {
  width: 100%;
  height: 600px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
}

.entry-history {
  margin-top: 20px;
}

.entry-history ul {
  list-style-type: none;
  padding: 0;
}

.entry-history li {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 5px;
}
</style>