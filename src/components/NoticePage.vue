<template>
  <a-flex>
    <a-card hoverable style="width: 100vw;max-height: 40vw;height: 40vw">
      <div 
      style="text-align: center;word-wrap: break-word;font-size: 20px;" 
      v-if="currentTitle">{{ currentTitle }}</div>
      <div 
      style="text-align: center;word-wrap: break-word;font-size: 15px" 
      v-if="currentTitle">发布时间：{{ currentTime }}</div>
      <div style="word-wrap: break-word;white-space: pre-wrap;overflow: auto;max-height: 35vw">{{ currentContent }}</div>
    </a-card>
  </a-flex>
  <br />
  <div style="text-align: center;">
    <a-pagination 
    v-model:current="currentPage" 
    :total="maxid" 
    :defaultPageSize=1 
    show-less-items 
    @change="pageChange" 
    />
  </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
export default {
  data() {
    return {
      notices: [],
      currentPage: 1,
      titles: [],
      contents: [],
      times: []
    };
  },
  created() {
    this.fetchNotices();
  },
  methods: {
    async fetchNotices() {
      try {
        const response = await axios.get('http://localhost:3000/api/notice');
        this.notices = response.data;
      } catch (error) {
        console.error('获取通知数据失败:', error);
      }
      this.titles = this.notices.map((notice) => notice.title);
      this.contents = this.notices.map((notice) => notice.content);
      this.times = this.notices.map((notice) => notice.time);
    },
    pageChange(page) {
      this.currentPage = page;
      //返回当前页码
    },
  },
  computed: {
    maxid() {
      // 使用 map 提取所有 id，然后用 Math.max 获取最大值
      return Math.max(...this.notices.map(item => item.id));
    },
    currentTitle() {
      return this.titles[this.currentPage - 1] || null;
    },
    currentContent() {
      return this.contents[this.currentPage - 1] || null;
    },
    currentTime() {
      return dayjs(this.times[this.currentPage - 1]).format('YYYY-MM-DD HH:mm:ss') || null;
      //格式化时间
    }
  }
};
</script>