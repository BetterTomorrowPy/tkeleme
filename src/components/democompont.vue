<template>
  <div>
    <button @click="show = !show">
      点我
    </button>
    <transition name="fade">
      <p v-if="show">show me.</p>
    </transition>
  </div>
</template>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
</style>

<script>
  export default{
    data(){
      return {
        show: true
      }
    }
  }
</script>
