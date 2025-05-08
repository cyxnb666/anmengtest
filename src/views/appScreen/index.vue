<template>
    <div class="home-app-screen-style">
      哈哈
      <div class="box">在小程序中</div>
    </div>
  </template>
  <script>
  import { _isMobile } from '@/utils/tools'
  export default {
    data() {
      return {}
    },
    components: {},
    beforeRouteEnter(to, from, next) {
      if (_isMobile()) {
        next()
      } else {
        next('/screen')
      }
    },
    mounted() {},
    methods: {},
  }
  </script>
  <style scoped lang="scss">
  .home-app-screen-style {
    font-size: 14px;
    .box {
      width: 1rem;
      height: 20px;
      background: #000;
    }
  }
  </style>
  