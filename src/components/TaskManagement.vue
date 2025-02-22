<template>
  <div class="task-management">
    <h1>任务管理</h1>
    <div class="task-form">
      <h2>发布新任务</h2>
      <form @submit.prevent="createTask">
        <div class="form-group">
          <label for="taskName">任务名称:</label>
          <input type="text" v-model="taskName" required />
        </div>
        <div class="form-group">
          <label for="taskContent">任务内容:</label>
          <textarea v-model="taskContent" required></textarea>
        </div>
        <div class="form-group">
          <label for="groupId">分组ID:</label>
          <input type="number" v-model="groupId" required />
        </div>
        <div class="form-group">
          <label for="publishTime">发布时间:</label>
          <input type="datetime-local" v-model="publishTime" required />
        </div>
        <div class="form-group">
          <label for="deadline">截止时间:</label>
          <input type="datetime-local" v-model="deadline" required />
        </div>
        <button type="submit" class="submit-button">发布任务</button>
      </form>
    </div>
    <div class="student-answers">
      <h2>学生作答情况</h2>
      <div v-if="studentAnswers.length">
        <ul>
          <li v-for="answer in studentAnswers" :key="answer.student_id">
            {{ answer.student_name }}: {{ answer.answer_content }}
          </li>
        </ul>
      </div>
      <div v-else>
        <p>暂无作答记录</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskManagement',
  data() {
    return {
      taskName: '',
      taskContent: '',
      groupId: null,
      publishTime: '',
      deadline: '',
      studentAnswers: []
    };
  },
  methods: {
    async createTask() {
      try {
        const response = await fetch('http://localhost:3000/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            taskName: this.taskName,
            taskContent: this.taskContent,
            groupId: this.groupId,
            publishTime: this.publishTime,
            deadline: this.deadline
          })
        });
        if (!response.ok) throw new Error('Failed to create task');
        alert('任务发布成功');
      } catch (error) {
        console.error('Error creating task:', error);
      }
    },
    async fetchStudentAnswers(taskId) {
      try {
        const response = await fetch(`http://localhost:3000/api/task/${taskId}/answers`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch student answers');
        this.studentAnswers = await response.json();
      } catch (error) {
        console.error('Error fetching student answers:', error);
      }
    }
  },
  mounted() {
    const taskId = 1; // 这里需要根据实际情况设置
    this.fetchStudentAnswers(taskId);
  }
};
</script>

<style scoped>
.task-management {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1, h2 {
  color: #333;
  margin-bottom: 20px;
}

.task-form, .student-answers {
  margin-bottom: 40px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
input[type="number"],
input[type="datetime-local"],
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 10px;
}

textarea {
  resize: vertical;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #45a049;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style> 