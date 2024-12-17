<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <!-- 左侧sidebar -->
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
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
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0" />
      <a-layout-content style="margin: 0 16px">
        <div :style="{ padding: '24px', background: '#fff', minHeight: '100%' }">
          <!-- 右侧内容 -->
          <component :is="currentComponent" @change-component="loadComponent"/>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        <!-- 下方标志 -->
        测试 ©2024 Created By Giant_GKL
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import HomePage from './components/HomePage.vue';
import TargetPage from './components/TargetPage.vue';
import NoticePage from './components/NoticePage.vue';

export default {
  name: 'ParentComponent',
  components: { HomePage, TargetPage, NoticePage },
  data() {
    return {
      currentComponent: HomePage,
      selectedKeys: ['1'],
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
      }
    },
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
</style>