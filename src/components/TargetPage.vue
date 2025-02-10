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
    <a-card style="width: 100%" hoverable v-for="i in plans" :key="i.planID">
      <a-card class="text-ellipsis" style="width: 55%; display: inline-block;">{{ i.title }}</a-card>
      <a-space :size="20">
        <a-card style="display: inline-block;">截止时间：{{ formatDate(i.endDate) }}</a-card>
        <a-tooltip title="6 已完成 / 4 未完成">
          <a-progress :percent="60" type="dashboard" :size="70"/>
        </a-tooltip>
        <a-button type="primary" @click="showDrawer(i.planID)">详情</a-button>
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
          <a-textarea v-model:value="i.value" placeholder="目标内容" :rows="4" />
          <!-- <a-date-picker v-model="dateTime" show-time placeholder="预计截止时间" />  -->
          <a-button type="primary" @click="addSubplan(i.planID,value,0)">添加</a-button>
          <a-card hoverable v-for="j in subplans">
            <a-card v-if="i.planID == j.planID" style="width:90%;word-wrap: break-word;display:inline-block; vertical-align: middle;">
              <a-tag v-if="j.completion" color="green">已完成</a-tag>
              <a-tag v-else color="red">未完成</a-tag>
              {{ j.content }}
            </a-card>
            <a-button @click="deleteSubplan(j.subplanID)" v-if="i.planID == j.planID" style="display:inline-block; vertical-align: middle;" danger>删除</a-button>
          </a-card>
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
      subplans: [],
      formData: {
        planID: '',
        content: '',
        completion: 0
      }
    };
  },
  created(){
    this.fetchPlans();
  },
  methods: {
    async fetchPlans() {
      try {
        const response1 = await axios.get('http://localhost:3000/api/plan');
        const response2 = await axios.get('http://localhost:3000/api/subplan');
        this.plans = response1.data;
        this.subplans = response2.data;
      } catch (error) {
        console.error('获取目标数据失败:', error);
      }
      console.log(this.plans[0]);
    },
    async addSubplan(ID,con,com) {
      console.log(con);
      this.formData.planID = ID;
      this.formData.content = con;
      this.formData.completion = com;
      try {
        const response = await axios.post('http://localhost:3000/api/addsubplan', this.formData);
      }catch(e) {
        console.log(e);
      }
      await this.fetchPlans();
    },
    async deleteSubplan(ID) {
      try {
        const response = await axios.post(`http://localhost:3000/api/deletesubplan/${ID}`);
      }catch(e) {
        console.log(e);
      }
    },
    afterOpenChange(bool) {
      console.log('open', bool);
    },
    showDrawer(planID) {
      this.plans.forEach(plan => {
        plan.open = false;
      });
      const selectedPlan = this.plans.find(plan => plan.planID === planID);
      if (selectedPlan) {
        selectedPlan.open = true;
      }
    },
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  computed: {
  }
};
</script>

<style scoped>
.text-ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ant-card {
  cursor: default !important;
}
</style>