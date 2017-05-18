/**
 * Created by Administrator on 2017/5/18.
 */

// import Vue from 'vue'

var apiURL = 'https://api.github.com/repos/vuejs/vue/commits?per_page=15&sha='


var vm = new Vue({
  el: '#demo',
  data: {
    branches: ['master', 'weex', 'typings-refactor'],
    currentBranch: 'master',
    commits: []
  },
  filters: {
    // 过滤换行
    truncate: function (v) {
      var newline = v.indexOf('\n');
      return newline > 0 ? v.slice(0, newline) : v;
    },
    // 格式化时间
    formatDate: function (v) {
      return v.replace(/T|Z/g, ' ');
    }
  },
  methods: {
    // use source ajax
    fetchData: function () {
      let xhr = new XMLHttpRequest();
      let that = this;
      console.log(this.currentBranch)
      xhr.open('GET', apiURL + that.currentBranch);
      xhr.onload = function () {
        that.commits = JSON.parse(xhr.responseText);
        console.log(that.commits[0].html_url)
      };
      xhr.send()
    },
    // use fetch
    fetchFetchData: async function () {
      let request = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
      let that = this;
      let response = await fetch(apiURL + that.currentBranch, request);
      let responseJson = await response.json();
      that.commits = responseJson
      console.log(responseJson)
    }
  },
  created: function () {
    this.fetchFetchData();
    // this.fetchData();
  },
})
