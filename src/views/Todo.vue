<template>
  <div>
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <!-- 输入备忘内容，按 Enter 键时触发添加 -->
        <input class="new-todo" placeholder="你接下来要做什么？" v-model="newTodo" v-autofocus @keyup.enter="addTodo" />
      </header>
      <section class="main" v-show="todos.length">
        <!-- 操作过渡动画 -->
        <transition-group
          name="staggered-fade"
          tag="ul"
          :css="false"
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave"
          class="todo-list"
        >
          <!-- 查看所有备忘 -->
          <li v-for="todo in computedTodos" class="todo" :key="todo.id" :class="{ completed: todo.completed }">
            <!-- <todo-item :title.sync="todo.title" :completed.sync="todo.completed" @delete="removeTodo(todo)"></todo-item> -->
            <!-- 双向绑定整个对象：title、completed、complete_time -->
            <todo-item v-bind.sync="todo" @delete="removeTodo(todo)" @modified="saveData(todo)"></todo-item>
          </li>
        </transition-group>
        <footer class="footer" v-show="todos.length">
          <!-- 未完成数量，支持单复数显示 -->
          <span class="todo-count">
            <strong>{{ remaining }}</strong> {{ remaining | pluralize }} left
          </span>
          <!-- 备忘筛选 -->
          <ul class="filters">
            <li>
              <router-link :to="{ query: { state: '' } }" active-class="selected" exact>All</router-link>
            </li>
            <li>
              <router-link :to="{ query: { state: 'active' } }" active-class="selected" exact> Active</router-link>
            </li>
            <li>
              <router-link :to="{ query: { state: 'completed' } }" active-class="selected" exact>completed</router-link>
            </li>
          </ul>
          <!-- 一键删除已完成的备忘按钮 -->
          <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
            Clear completed
          </button>
        </footer>
      </section>
    </section>
    <section>
      <ul>
        <li v-for="todo in allCompletedTodos" :key="todo.id">
          Title：{{ todo.title }} Completed：{{ todo.complete_time.substring(0, 10) }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import TodoItem from '../components/TodoItem';
import Velocity from 'velocity-animate';

export default {
  components: {
    'todo-item': TodoItem,
  },
  data() {
    return {
      id: localStorage.getItem('todo-id') || 1, // 备忘递增ID
      todos: JSON.parse(localStorage.getItem('todos') || '[]'), // 备忘列表
      allCompletedTodos: JSON.parse(localStorage.getItem('all-completed-todos') || '[]'), // 弹窗信息
      newTodo: '', // 新增的备忘内容
    };
  },
  watch: {
    // 监听备忘列表的变化，每次更新写入缓存（注意：具体备忘内容更新时，无法监听到，无法写入缓存）
    todos(newVal) {
      localStorage.setItem('todos', JSON.stringify(newVal));
      localStorage.setItem('todo-id', this.id);
    },
  },
  computed: {
    // 计算剩余未完成的备忘
    remaining() {
      return this.todos.filter(x => !x.completed).length;
    },
    // 筛选备忘
    computedTodos() {
      // 先按状态过滤
      const state = this.$route.query.state;
      const filterTodos = this.todos.filter(x => {
        if (state === 'active') {
          return !x.completed;
        } else if (state === 'completed') {
          return x.completed;
        } else {
          return true;
        }
      });
      // 再按输入内容过滤
      return filterTodos.filter(item => item.title.toLowerCase().indexOf(this.newTodo.toLowerCase()) !== -1);
    },
  },
  methods: {
    // 新增备忘
    addTodo() {
      if (!this.newTodo) {
        return;
      }
      this.todos.unshift({
        id: this.id++,
        title: this.newTodo,
        completed: false,
        create_time: new Date().Format('yyyy-MM-dd hh:mm:ss'),
        complete_time: '',
      });
      this.newTodo = '';
    },
    // 删除备忘
    removeTodo(todo) {
      const index = this.todos.findIndex(x => x.id === todo.id);
      this.todos.splice(index, 1);
    },
    // 删除已完成的备忘
    removeCompleted() {
      this.todos = this.todos.filter(x => !x.completed);
    },
    // 进入中
    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.height = 0;
    },
    // 此回调函数是可选项的设置
    // 与 CSS 结合时使用
    enter(el, done) {
      // 设置延时
      var delay = el.dataset.index * 150;
      setTimeout(function() {
        Velocity(el, { opacity: 1, height: '58px' }, { complete: done });
      }, delay);
    },
    // 离开时
    // 此回调函数是可选项的设置
    // 与 CSS 结合时使用
    leave(el, done) {
      // 设置延时
      var delay = el.dataset.index * 150;
      setTimeout(function() {
        Velocity(el, { opacity: 0, height: 0 }, { complete: done });
      }, delay);
    },
    // 单个备忘修改时触发更新，写入缓存
    saveData() {
      localStorage.setItem('todos', JSON.stringify(this.todos));
    },
  },
  // directives: {
  //   // 注册一个局部指令 `v-autofocus`
  //   autofocus: {
  //     inserted: function(el) {
  //       el.focus();
  //     },
  //   },
  // },
  filters: {
    // 单复数状态计算
    pluralize(num) {
      return num > 1 ? 'items' : 'item';
    },
  },
};
</script>

<style>
/* @import 'https://unpkg.com/todomvc-app-css@2.1.0/index.css'; */
*,
::after,
::before {
  box-sizing: inherit;
}

html,
body {
  margin: 0;
  padding: 0;
}

button {
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font-size: 100%;
  vertical-align: baseline;
  font-family: inherit;
  font-weight: inherit;
  color: inherit;
  -webkit-appearance: none;
  appearance: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.4em;
  background: #f5f5f5;
  color: #4d4d4d;
  min-width: 230px;
  max-width: 550px;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 300;
}

:focus {
  outline: 0;
}

.hidden {
  display: none;
}

.todoapp {
  background: #fff;
  margin: 130px 0 40px 0;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
}

.todoapp input::-webkit-input-placeholder {
  font-style: italic;
  font-weight: 300;
  color: #e6e6e6;
}

.todoapp input::-moz-placeholder {
  font-style: italic;
  font-weight: 300;
  color: #e6e6e6;
}

.todoapp input::input-placeholder {
  font-style: italic;
  font-weight: 300;
  color: #e6e6e6;
}

.todoapp h1 {
  position: absolute;
  top: -155px;
  width: 100%;
  font-size: 100px;
  font-weight: 100;
  text-align: center;
  color: rgba(175, 47, 47, 0.15);
  -webkit-text-rendering: optimizeLegibility;
  -moz-text-rendering: optimizeLegibility;
  text-rendering: optimizeLegibility;
}

.new-todo,
.edit {
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  border: 0;
  color: inherit;
  padding: 6px;
  border: 1px solid #999;
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.new-todo {
  padding: 16px 16px 16px 60px;
  border: none;
  background: rgba(0, 0, 0, 0.003);
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
}

.main {
  position: relative;
  z-index: 2;
  border-top: 1px solid #e6e6e6;
}

.toggle-all {
  text-align: center;
  border: none; /* Mobile Safari */
  opacity: 0;
  position: absolute;
}

.toggle-all + label {
  width: 60px;
  height: 34px;
  font-size: 0;
  position: absolute;
  top: -52px;
  left: -13px;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}

.toggle-all + label:before {
  content: '❯';
  font-size: 22px;
  color: #e6e6e6;
  padding: 10px 27px 10px 27px;
}

.toggle-all:checked + label:before {
  color: #737373;
}

.todo-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.todo-list li {
  position: relative;
  font-size: 24px;
  border-bottom: 1px solid #ededed;
}

.todo-list li:last-child {
  border-bottom: none;
}

.todo-list li.editing {
  border-bottom: none;
  padding: 0;
}

.todo-list li.editing .edit {
  display: block;
  width: 506px;
  padding: 12px 16px;
  margin: 0 0 0 43px;
}

.todo-list li.editing .view {
  display: none;
}

.todo-list li .toggle {
  text-align: center;
  width: 40px;
  /* auto, since non-WebKit browsers doesn't support input styling */
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  border: none; /* Mobile Safari */
  -webkit-appearance: none;
  appearance: none;
}

.todo-list li .toggle {
  opacity: 0;
}

.todo-list li .toggle + label {
  /*
		Firefox requires `#` to be escaped - https://bugzilla.mozilla.org/show_bug.cgi?id=922433
		IE and Edge requires *everything* to be escaped to render, so we do that instead of just the `#` - https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7157459/
	*/
  background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
  background-repeat: no-repeat;
  background-position: center left;
}

.todo-list li .toggle:checked + label {
  background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E');
}

.todo-list li label {
  word-break: break-all;
  padding: 15px 15px 15px 60px;
  display: block;
  line-height: 1.2;
  transition: color 0.4s;
}

.todo-list li.completed label {
  color: #d9d9d9;
  text-decoration: line-through;
}

.todo-list li .destroy {
  display: none;
  position: absolute;
  top: 0;
  right: 10px;
  bottom: 0;
  width: 40px;
  height: 40px;
  margin: auto 0;
  font-size: 30px;
  color: #cc9a9a;
  margin-bottom: 11px;
  transition: color 0.2s ease-out;
}

.todo-list li .destroy:hover {
  color: #af5b5e;
}

.todo-list li .destroy:after {
  content: '×';
}

.todo-list li:hover .destroy {
  display: block;
}

.todo-list li .edit {
  display: none;
}

.todo-list li.editing:last-child {
  margin-bottom: -1px;
}

.footer {
  color: #777;
  padding: 10px 15px;
  height: 20px;
  text-align: center;
  border-top: 1px solid #e6e6e6;
}

.footer:before {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 50px;
  overflow: hidden;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6, 0 9px 1px -3px rgba(0, 0, 0, 0.2),
    0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgba(0, 0, 0, 0.2);
}

.todo-count {
  float: left;
  text-align: left;
}

.todo-count strong {
  font-weight: 300;
}

.filters {
  margin: 0;
  padding: 0;
  list-style: none;
  position: absolute;
  right: 0;
  left: 0;
}

.filters li {
  display: inline;
}

.filters li a {
  color: inherit;
  margin: 3px;
  padding: 3px 7px;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 3px;
}

.filters li a:hover {
  border-color: rgba(175, 47, 47, 0.1);
}

.filters li a.selected {
  border-color: rgba(175, 47, 47, 0.2);
}

.clear-completed,
html .clear-completed:active {
  float: right;
  position: relative;
  line-height: 20px;
  text-decoration: none;
  cursor: pointer;
}

.clear-completed:hover {
  text-decoration: underline;
}

.info {
  margin: 65px auto 0;
  color: #bfbfbf;
  font-size: 10px;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  text-align: center;
}

.info p {
  line-height: 1;
}

.info a {
  color: inherit;
  text-decoration: none;
  font-weight: 400;
}

.info a:hover {
  text-decoration: underline;
}

/*
	Hack to remove background from Mobile Safari.
	Can't use it globally since it destroys checkboxes in Firefox
*/
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  .toggle-all,
  .todo-list li .toggle {
    background: none;
  }

  .todo-list li .toggle {
    height: 40px;
  }
}

@media (max-width: 430px) {
  .footer {
    height: 50px;
  }

  .filters {
    bottom: 10px;
  }
}
</style>
