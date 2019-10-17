
// 通过EventBus进行兄弟间组件通讯
import Vue from 'vue';
const eventBus = new Vue();

export default eventBus;

Vue.prototype.eventBus = eventBus