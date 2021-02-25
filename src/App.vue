<template>
  <div id="app">
    <!-- 使用 <router-view /> 来渲染最高级路由匹配到的组件 -->
    <router-view />
    <!-- 动态组件由 vm 实例的 component 控制，done 事件用于监听用户操作完毕时触发 -->
    <component
      v-for="(item, index) in items"
      :key="index"
      :is="item.component"
      :dialogInfo="item.dialogInfo"
      @done="doneDialog(index)"
    ></component>
  </div>
</template>

<script>
import ConfirmDialog from './components/ConfirmDialog'; // 弹窗组件
import vm from './main'; // 获取 Vue 实例

export default {
  name: 'app',
  data() {
    return {
      items: [],
    };
  },
  mounted() {
    // 如果在这里，首次加载页面的时候，无法正确获取到 Vue 实例，因为 DOM 还没有更新
    this.$nextTick(() => {
      // DOM 现在更新了
      // 监听设置弹窗事件
      vm.$on('setDialog', dialogInfo => {
        this.items.push({ dialogInfo, component: ConfirmDialog });
      });
    });
  },
  methods: {
    doneDialog(index) {
      this.items.splice(index, 1); // 用户已经点击了该弹窗，可以从列表中移除了
    },
  },
};
</script>
