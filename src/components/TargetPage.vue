<template>
  <a-flex>
    <a-input-search
    v-model:value="value"
    placeholder="搜索目标"
    enter-button
    @search="onSearch"
    style="width: 100vw"
    />
  </a-flex>
  <a-flex style="flex-direction: column;">
    <a-card style="width: 100%" hoverable v-for="i in plans" :key="i.id">
      <a-card class="text-ellipsis" style="width: 55%; display: inline-block;">{{ i.title }}</a-card>
      <a-space :size="20">
        <a-card style="display: inline-block;">截止时间：{{ formatDate(i.endDate) }}</a-card>
        <a-tooltip title="6 已完成 / 4 未完成">
          <a-progress :percent="60" type="dashboard" :size="70"/>
        </a-tooltip>
        <a-button type="primary" @click="showDrawer(i.id)">详情</a-button>
        <a-drawer
        v-model:open="i.open"
        class="custom-class"
        root-class-name="root-class-name"
        title="目标详情"
        size="large"
        placement="right"
        @after-open-change="afterOpenChange"
        >
          <p>目标名称：{{ i.title }}</p>
          <p>内容：{{ i.content }}</p>
        </a-drawer>
      </a-space>
    </a-card>
  </a-flex>
</template>
<script>
import axios from 'axios';
import dayjs from 'dayjs';
export default {
  data() {
    return {
      open: false,
      plans: [],
    };
  },
  created(){
    this.fetchNotices();
  },
  methods: {
    async fetchNotices() {
      try {
        const response = await axios.get('http://localhost:3000/api/plan');
        this.plans = response.data;
      } catch (error) {
        console.error('获取目标数据失败:', error);
      }
    },
    afterOpenChange(bool) {
      console.log('open', bool);
    },
    showDrawer(id) {
      this.plans.forEach(plan => {
        plan.open = false;
      });
      const selectedPlan = this.plans.find(plan => plan.id === id);
      if (selectedPlan) {
        selectedPlan.open = true;
      }
    },
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  computed: {
    maxid() {
      return Math.max(...this.plans.map(item => item.id));
    },
  }
};
</script>

<style scoped>
.text-ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>