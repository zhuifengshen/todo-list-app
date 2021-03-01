<template>
  <div :class="{ editing: isEdited }">
    <div class="view">
      <!-- 备忘勾选完成 -->
      <input class="toggle" type="checkbox" v-model="checkboxStatus" @change="updateChecked($event.target.checked)" />
      <!-- 备忘双击进入编辑 -->
      <label @dblclick="editTodo">{{ title }}</label>
      <!-- 备忘删除 -->
      <button class="destroy" @click="removeTodo"></button>
    </div>
    <!-- 修改备忘的数据，失焦或 Enter 键可更新数据， Esc 键取消更新 -->
    <input
      class="edit"
      type="text"
      v-model="editingTitle"
      v-autofocus
      v-if="isEdited"
      @blur="doneEdit"
      @keyup.enter="doneEdit"
      @keyup.esc="cancelEdit"
    />
  </div>
</template>

<script>
import confirmDialog from '../utils/confirm';
export default {
  data() {
    return {
      isEdited: false, // 是否在编辑中状态
      editingTitle: '', // 编辑中的内容
      checkboxStatus: this.completed, // 备忘初始化状态
    };
  },
  props: {
    // 备忘内容
    title: {
      type: String,
      default: '',
    },
    // 备忘状态
    completed: {
      type: Boolean,
      default: false,
    },
    // 备忘完成时间
    completed_time: {
      type: String,
      default: '',
    },
  },
  methods: {
    // 修改备忘
    editTodo() {
      this.editingTitle = this.title;
      this.isEdited = true;
    },
    // 修改完成
    doneEdit() {
      if (this.isEdited) {
        this.$emit('update:title', this.editingTitle);
        this.$emit('modified');
        this.isEdited = false;
      }
    },
    // 取消修改
    cancelEdit() {
      this.isEdited = false;
    },
    // 备忘状态更新
    updateChecked(completed) {
      this.$emit('update:completed', completed);
      if (completed) {
        this.$emit('update:complete_time', new Date().Format('yyyy-MM-dd hh:mm:ss'));
      } else {
        this.$emit('update:complete_time', '');
      }
      this.$emit('modified');
    },
    // 删除备忘
    removeTodo() {
      confirmDialog({ text: '确认要删除吗？' })
        .then(() => this.$emit('delete'))
        .catch(() => console.log('用户点击了取消按钮！'));
    },
  },
  // directives: {
  //   // 注册一个局部指令 `v-autofocus`
  //   // 被绑定元素插入父节点时调用
  //   autofocus: {
  //     inserted: function(el) {
  //       el.focus();
  //     },
  //   },
  // },
};
</script>

<style scoped>
.todo-list li .editing .view {
  display: none;
}
.todo-list li .editing .edit {
  display: block;
  width: 506px;
  padding: 12px 16px;
  margin: 0 0 0 43px;
}
</style>
