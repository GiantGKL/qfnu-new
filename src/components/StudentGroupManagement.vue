<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">分组管理</h1>
    <!-- 创建分组按钮 -->
    <button 
      @click="showCreateModal = true"
      class="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
    >
      + 创建新分组
    </button>

    <!-- 分组列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="group in groups" 
        :key="group.group_id"
        class="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-semibold text-gray-800">{{ group.group_name }}</h3>
            <p class="text-sm text-gray-500 mt-1">
              创建于 {{ formatDate(group.create_time) }}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              成员数量: {{ group.members.length }}
            </p>
          </div>
          <button @click="toggleMembers(group.group_id)" class="text-blue-500 hover:underline">
            {{ group.showMembers ? '隐藏成员' : '查看成员' }}
          </button>
        </div>

        <!-- 成员列表 -->
        <div v-if="group.showMembers" class="border-t pt-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">成员列表</h4>
          <div class="flex flex-wrap gap-2">
            <div 
              v-for="member in group.members"
              :key="member.StudentID"
              class="bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-600"
            >
              {{ member.Name }} ({{ member.StudentID }})
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建分组模态框 -->
    <div 
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-2xl max-w-md w-full shadow-xl">
        <div class="p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">新建分组</h2>
          
          <input
            v-model="newGroup.name"
            placeholder="请输入分组名称"
            class="w-full mb-6 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >

          <h3 class="text-lg font-medium text-gray-700 mb-4">选择成员</h3>
          <div class="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto p-2">
            <label
              v-for="student in filteredStudents"
              :key="student.StudentID"
              class="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <input
                type="checkbox"
                :value="student.StudentID"
                v-model="newGroup.selectedStudents"
                class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              >
              <div>
                <span class="block text-gray-700">{{ student.Name }}</span>
                <span class="block text-sm text-gray-500">{{ student.StudentID }}</span>
              </div>
            </label>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="showCreateModal = false"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              @click="createGroup"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              创建
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, toRaw } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const groups = ref([]);
    const showCreateModal = ref(false);
    const newGroup = ref({
      name: '',
      selectedStudents: []
    });
    const filteredStudents = ref([]);

    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
        const response = await axios.get('http://localhost:3000/api/groups', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        groups.value = response.data.map(group => ({
          ...group,
          showMembers: false // 用于控制成员列表的显示
        }));
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/students');
        console.log('学生数据:', response.data);
        if (response.data && Array.isArray(response.data)) {
          filteredStudents.value = response.data.map(student => ({
            StudentID: student.StudentID,
            Name: student.Name
          }));
        }
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };

    const createGroup = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
        const response = await axios.post('http://localhost:3000/api/groups', {
          group_name: newGroup.value.name,
          student_ids: newGroup.value.selectedStudents
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('创建分组成功:', response.data);
        await fetchGroups();
        newGroup.value.name = '';
        newGroup.value.selectedStudents = [];
      } catch (error) {
        console.error('Failed to create group:', error);
        alert('创建分组失败，请检查输入数据和网络连接。');
      } finally {
        showCreateModal.value = false;
      }
    };

    const toggleMembers = (groupId) => {
      const group = groups.value.find(g => g.group_id === groupId);
      if (group) {
        group.showMembers = !group.showMembers;
      }
    };

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    onMounted(() => {
      fetchGroups();
      fetchStudents();
    });

    return {
      groups,
      showCreateModal,
      newGroup,
      filteredStudents,
      createGroup,
      toggleMembers,
      formatDate
    };
  },
};
</script>

<style>
/* 添加 Tailwind CSS 的 CDN 链接到项目 */
@import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full hover:bg-gray-400;
}
</style>