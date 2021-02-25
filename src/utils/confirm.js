import vm from '../main';

export function confirmDialog({ title, text, cancelText, confirmText }) {
  return new Promise((resolve, reject) => {
    vm.$emit('setDialog', { title, text, cancelText, confirmText, resolve, reject }); // 向父组件传递设置弹窗事件
  });
}

export default confirmDialog;
