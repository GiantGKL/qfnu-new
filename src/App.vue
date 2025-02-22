<template>
  <a-layout :style="{ minHeight: '100vh', backgroundImage: showLogin ? 'url(@/assets/images/学生端背景图.jpg)' : 'none' }">
    <a-layout-sider v-if="!showLogin" v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <!-- 左侧sidebar -->
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <template v-if="userRole === 'student'">
          <a-menu-item key="1" @click="loadComponent('HomePage',1)">
            <span>主页</span>
          </a-menu-item>
          <a-menu-item key="2" @click="loadComponent('NoticePage',1)">
            <span>通知</span>
          </a-menu-item>
          <a-menu-item key="3" @click="loadComponent('TargetPage',1)">
            <span>目标</span>
          </a-menu-item>
          <a-menu-item key="4">
            <span>设置</span>
          </a-menu-item>
          <a-menu-item key="5" @click="loadComponent('PerceptionComponent')">
            <span>任务</span>
          </a-menu-item>
        </template>
        <template v-else-if="userRole === 'teacher'">
          <a-menu-item key="1" @click="loadComponent('TeacherHomePage',1)">
            <span>教师主页</span>
          </a-menu-item>
          <a-menu-item key="2" @click="loadComponent('TeacherNoticePage',1)">
            <span>教师通知</span>
          </a-menu-item>
          <a-menu-item key="3" @click="loadComponent('TeacherSettings',1)">
            <span>教师设置</span>
          </a-menu-item>
          <a-menu-item key="4" @click="loadComponent('StudentGroupManagement',1)">
            <span>学生分组管理</span>
          </a-menu-item>
          <a-menu-item key="5" @click="loadComponent('TaskManagement',1)">
            <span>任务管理</span>
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header v-if="!showLogin" style="background: #fff; padding: 0" />
      <a-layout-content style="margin: 0 16px">
        <div class="content-wrapper">
          <!-- 右侧内容 -->
          <component :is="currentComponent" @change-component="loadComponent" @login-success="handleLoginSuccess"/>
        </div>
      </a-layout-content>
      <a-layout-footer v-if="!showLogin" style="text-align: center">
        <!-- 下方标志 -->
        测试 ©2024 Created By Giant_GKL and G's father_ci
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import HomePage from './components/HomePage.vue';
import TargetPage from './components/TargetPage.vue';
import NoticePage from './components/NoticePage.vue';
import PerceptionComponent from './components/Perception.vue';
import Login from './components/Login.vue';
import TeacherHomePage from './components/TeacherHomePage.vue';
import TeacherNoticePage from './components/TeacherNoticePage.vue';
import TeacherSettings from './components/TeacherSettings.vue';
import StudentGroupManagement from './components/StudentGroupManagement.vue';
import TaskManagement from './components/TaskManagement.vue';
import { markRaw } from 'vue';

export default {
  name: 'ParentComponent',
  components: { HomePage, TargetPage, NoticePage, PerceptionComponent, Login, TeacherHomePage, TeacherNoticePage, TeacherSettings, StudentGroupManagement, TaskManagement },
  data() {
    return {
      currentComponent: markRaw(Login),
      selectedKeys: ['5'],
      collapsed: false,
      showLogin: true,
      userRole: localStorage.getItem('userRole') || 'student',
    };
  },
  methods: {
    loadComponent(componentName) {
      if (componentName === 'HomePage') {
        this.currentComponent = HomePage;
        this.selectedKeys = ['1'];
      } else if (componentName === 'TargetPage') {
        this.currentComponent = TargetPage;
        this.selectedKeys = ['3'];
      } else if (componentName === 'NoticePage') {
        this.currentComponent = NoticePage;
        this.selectedKeys = ['2'];
      } else if (componentName === 'PerceptionComponent') {
        this.currentComponent = PerceptionComponent;
        this.selectedKeys = ['5'];
      } else if (componentName === 'TeacherHomePage') {
        this.currentComponent = TeacherHomePage;
        this.selectedKeys = ['1'];
      } else if (componentName === 'TeacherNoticePage') {
        this.currentComponent = TeacherNoticePage;
        this.selectedKeys = ['2'];
      } else if (componentName === 'TeacherSettings') {
        this.currentComponent = TeacherSettings;
        this.selectedKeys = ['3'];
      } else if (componentName === 'StudentGroupManagement') {
        this.currentComponent = StudentGroupManagement;
        this.selectedKeys = ['4'];
      } else if (componentName === 'TaskManagement') {
        this.currentComponent = TaskManagement;
        this.selectedKeys = ['5'];
      }
    },
    handleLoginSuccess() {
      this.showLogin = false;
      this.userRole = localStorage.getItem('userRole');
      if (this.userRole === 'student') {
        this.loadComponent('HomePage');
      } else if (this.userRole === 'teacher') {
        this.loadComponent('TeacherHomePage');
      }
    },
    onLogin() {
      console.log('Login button clicked');
      fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Login successful:', data);
        this.handleLoginSuccess();
      })
      .catch(error => {
        console.error('There was a problem with the login request:', error);
      });
    }
  },
};
</script>

<style scoped>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}

.content-wrapper {
  padding: 24px;
  min-height: 100%;
}
</style>