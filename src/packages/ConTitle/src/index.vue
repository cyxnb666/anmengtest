<template>
    <div class="con-title-main">
      <div class="con-title-inner">
        {{ text }}
      </div>
      <div class="con-title-content">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ConTitle',
    props: {
      text: {
        default: '',
      },
    },
    data() {
      return {}
    },
    methods: {},
  }
  </script>
  
  <style lang="scss" scoped>
  .con-title-main {
    .con-title-inner {
      margin-bottom: 20px;
      font-size: 18px;
      position: relative;
      text-indent: 10px;
      padding: 3px 0;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        width: 4px;
        height: 100%;
        top: 0;
        background: $menuActiveText;
      }
    }
    .con-title-content{
      padding: 0 20px;
    }
  }
  </style>
  