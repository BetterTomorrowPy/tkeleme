// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import FastClick from 'fastclick'
import routes from './router/index'
// import store from './store'

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body);
  }, false)
}

// Vue.config.productionTip = false
Vue.use(VueRouter)
const router = new VueRouter({
  routes,
  mode: 'history',
  strict: process.env.NODE_PATH !== 'production'
})


new Vue({
  router,
  // store,
}).$mount('#app')
