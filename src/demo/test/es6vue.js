/**
 * Created by Administrator on 2017/5/19.
 */

//

var foo = function () {
  let f = (i) => arguments[0] + i;
  return f(2);
}

foo(1);

var foo1 = function () {
  let f = (...args) => args[0];
  return f(2);
}

'use strict';
var obj = {
  i: 10,
  b: () => console.log(this.i, this),
  c: function() {
    console.log(this.i, this)
  }
}

import Vue from 'vue'

var vm = new Vue({
  el: '#app',
  data: {
    count: 1,
    content: null
  },
  created: async function () {
    let [url, that] = ['', this];
    let requestConfig = {
      method: 'GET',
      headers: {}
    };
    let response = await fetch(url, requestConfig);
    let responseJson = await response.json();
    that.content = responseJson.content;
  },
  computed: {
    contentLength: function () {
      if (typeof this.content === 'string') {
        return this.content.length
      } else {
        return 0
      }
    }
  },
  watch: {
    content: function () {

    }
  },
  filters: {
    formatDate: function (text) {
      return text.replace(/\r|\n/, '-')
    },
  }
})

