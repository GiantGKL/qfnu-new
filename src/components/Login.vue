/**
 * @author WangTianci
 * @version 1.0
 * @since 2024-11-20
 * @description 心得体会模块
 */
<template>
  <div class="login-container">
    <div class="login-form" v-if="!showRegister">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名:</label>
          <input 
            type="text" 
            id="username"
            v-model="username"
            required
          >
        </div>
        <div class="form-group">
          <label for="password">密码:</label>
          <input 
            type="password" 
            id="password"
            v-model="password"
            required
          >
        </div>
        <button type="submit">登录</button>
        <button type="button" class="forget-password" @click="forgetpassword">忘记密码</button>
        <button type="button" @click="showRegister = true">注册</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <!-- 注册表单 -->
    <div v-if="showRegister" class="register-modal">
      <div class="register-form">
        <h2>注册</h2>
        <div class="form-group">
          <label for="registerName">名字:</label>
          <input 
            type="text" 
            id="registerName"
            v-model="registerName"
            required
          >
        </div>
        <div class="form-group">
          <label for="registerUsername">用户名:</label>
          <input 
            type="text" 
            id="registerUsername"
            v-model="registerUsername"
            required
          >
        </div>
        <div class="form-group">
          <label for="registerPassword">密码:</label>
          <input 
            type="password" 
            id="registerPassword"
            v-model="registerPassword"
            required
          >
        </div>
        <div class="form-group">
          <label for="role">角色:</label>
          <select v-model="role" required>
            <option value="student">学生</option>
            <option value="teacher">教师</option>
          </select>
        </div>
        <button type="submit" @click.prevent="handleRegister">注册</button>
      </div>
    </div>

    <div v-if="showTip" class="tip-modal">
      <div class="tip-content">
        <p>请联系管理员处理密码问题</p>
        <button class="tip-btn" @click="closeTip">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const emit = defineEmits(['login-success']);
const router = useRouter();

const username = ref('');
const password = ref('');
const error = ref(null);
const showTip = ref(false);
const showRegister = ref(false);
const registerName = ref('');
const registerUsername = ref('');
const registerPassword = ref('');
const role = ref('student');

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      username: username.value,
      password: password.value,
    });
    const userRole = response.data.user.role;
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('token', response.data.token);

    if (userRole === 'student') {
      router.push('/student/home');
    } else if (userRole === 'teacher') {
      router.push('/teacher/home');
    }
    // 发出登录成功事件
    emit('login-success');
  } catch (err) {
    console.error('Login failed:', err);
    error.value = err.response ? err.response.data.message : "登录失败，请重试。";
  }
};

const handleRegister = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/register', {
      name: registerName.value,
      username: registerUsername.value,
      password: registerPassword.value,
      role: role.value,
    });
    alert('注册成功，请登录');
    showRegister.value = false;
  } catch (err) {
    console.error('注册失败:', err);
    error.value = err.response ? err.response.data.message : "注册失败，请重试。";
  }
};

const forgetpassword = () => {
  showTip.value = true;
};

const closeTip = () => {
  showTip.value = false;
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('~@/assets/images/学生端背景图.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.login-form {
  width: 300px;
  padding: 30px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.register-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.register-form {
  width: 300px;
  padding: 30px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.forget-password {
  background: none;
  border: none;
  text-align: right;
  display: block;
  font-size: 10px;
  margin-bottom: 20px;
  color: #666;
  cursor: pointer;
  width: 100%;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}

.form-group input:focus {
  border-color: #4CAF50;
  outline: none;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

button:active {
  transform: scale(0.98);
}

.error {
  color: #ff3860;
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
}

.tip-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.tip-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  min-width: 250px;
}

.tip-content p {
  margin-bottom: 15px;
  color: #333;
}

.tip-content button {
  width: auto;
  padding: 8px 20px;
  font-size: 14px;
}
</style> 