<template>
  <div class="modal" tabindex="-1" role="dialog" style="display: block">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <!-- 弹窗标题 -->
          <h4 class="modal-title">{{ dialogInfo.title || '提示' }}</h4>
        </div>
        <div class="modal-body">
          <!-- 弹窗内容 -->
          <p>{{ dialogInfo.text }}</p>
        </div>
        <div class="modal-footer">
          <!-- 取消按钮，点击取消，cancelText 可设置按钮文案 -->
          <button type="button" class="btn btn-default" @click="cancel">{{ dialogInfo.cancelText || '取消' }}</button>
          <!-- 确认按钮，点击确认，confirmText 可设置按钮文案 -->
          <button type="button" class="btn btn-primary" @click="confirm">{{ dialogInfo.confirmText || '确认' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 弹窗相关信息
    dialogInfo: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    cancel() {
      if (this.dialogInfo.reject) {
        this.dialogInfo.reject(); // 取消则执行reject
        this.$emit('done'); // 向父组件传递弹窗已完成处理事件，父组件删除弹窗对象
      }
    },
    confirm() {
      if (this.dialogInfo.resolve) {
        this.dialogInfo.resolve();
        this.$emit('done');
      }
    },
  },
};
</script>
<style scoped>
/* scoped：该组件中局部引入 bootstrap 样式，不影响全局样式 */
@import 'https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css';
</style>
