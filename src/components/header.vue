<template>
  <header id="head_top">
    <slot name="logo"></slot>
    <slot name="search"></slot>
    <section class="head_goback" v-if="goBack" @click="$router.go(-1)">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.2">
        <polyline></polyline>
      </svg>
    </section>
  </header>
</template>

<script>
  var headTop = function () {

  }
  var alertTip = function () {

  }
  export {headTop, alertTip}
</script>
