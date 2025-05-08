<template>
    <el-button
      v-bind="$attrs"
      v-on="$listeners"
      type='primary'
      @click="sendCode"
      :disabled="hasCount"
    >
       <span v-show='hasCount'>{{count}}s后</span> {{text}}
      <slot></slot>
    </el-button>
  </template>
  
  <script>
  import {sendSMS} from '@/api/modules/common.js'
  export default {
    name: "CodeBtn",
    props: {
      phone:{
        type:[Number,String],
        deault:''
      },
      isCustomSend:{
        type:Boolean,
        default:false
      },
      countAll:{
        type:Number,
        default:60
      },
      text: {
        default: "发送验证码",
      },
    },
    data() {
      return {
        count:0,
        timer:null,
        hasCount:false,
        insideValue: undefined,
      };
    },
    beforeDestroy(){
      this.closeTimer()
    },
    methods: {
      sendCode(){
        if(this.isCustomSend){
          return this.$emit('sendCode')
        }
        if(!this.phone){
          return this.$message.error('手机号码不能为空')
        }
        sendSMS({phone:this.phone}).then(res=>{
          if(res.code===200){
            this.$message.success('发送成功')
            this.$emit('sendSucccess')
            this.beginCountDown()
          }
        })
      },
      // 关闭计时器
      closeTimer() {
        if (this.timer) {
          clearInterval(this.timer);
        }
      },
      // 开始计时器
      beginCountDown() {
        this.hasCount = true; //倒计时
        this.count = this.countAll
        this.timer = setInterval(() => {
          this.count--; //递减
          if (this.count <= 0) {
            this.hasCount = false;
            clearInterval(this.timer);
          }
        }, 1000); //1000毫秒后执行
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  </style>
  