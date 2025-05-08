<template>
    <span class="status-btn-main" :style='customStyle'>
      {{title}}
    </span>
  </template>
  <script>
  export default {
    name:'StatusBtn',
    props: {
      title:{
        default:''
      },
      color:{
        default:"#409EFF"
      },
      bgColor:{
        default:'#EFF7FF'
      }
    },
    data() {
      return {}
    },
    computed:{
      customStyle({color,bgColor}){
        return {
          color,
          background:bgColor
        }
      }
    }
  }
  </script>
  <style scoped lang="scss">
  .status-btn-main{
    text-align: center;
    font-size: 12px;
    border-radius:5px;
    padding: 2px 10px;
    width: 68px;
    display: inline-block;
    background: #EFF7FF;
    color: #409EFF;
  }
  </style>
  