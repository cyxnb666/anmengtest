<template>
    <el-switch
      :value="_value"
      @change="onChange"
      v-bind="$attrs"
      :activeValue="activeValue"
      :inactiveValue="inactiveValue"
    ></el-switch>
  </template>
  
  <script>
  export default {
    name: 'TSwitch',
    props: {
      activeValue: {
        type: [String, Number, Boolean],
        default: true,
      },
      inactiveValue: {
        type: [String, Number, Boolean],
        default: false,
      },
      beforeChange: {
        type: Function,
      },
      value: {
        type: [String, Number, Boolean],
        default: false,
      },
    },
    data() {
      return {
        _value: '',
      }
    },
    created() {
      this._value = this.value // 将父组件传入的value值赋值给子组件
    },
    watch: {
      value: {
        handler(val) {
          this._value = val
        },
        immediate: true,
      },
    },
    methods: {
      onChange(changeVal) {
        // 定义一个变量存储改变之前的值
        let beforeVal = null
        // 保存状态改变之前的值
        if (this.activeValue !== '' && this.inactiveValue !== '') {
          beforeVal =
            changeVal === this.activeValue ? this.inactiveValue : this.activeValue
        } else {
          beforeVal = !changeVal
        }
        if (this.beforeChange) {
          // 传入组件changeVal
          this.beforeChange(changeVal)
            .catch(() => {
              changeVal = beforeVal
            })
            .finally(() => {
              // 请求不管成功还是失败最终会进到这里，成功时changeVal值不变，失败时修改为改变之前的值
              this._value = changeVal
              this.$emit('change', changeVal)
              // 抛出input事件，修改视图
              this.$emit('input', changeVal)
            })
        } else {
          this._value = changeVal
          this.$emit('change', changeVal)
          this.$emit('input', changeVal)
        }
      },
    },
  }
  </script>
  <style scoped lang="scss">
  .el-icon-question {
    color: #ccc;
    font-size: 20px;
    cursor: pointer;
    &:hover {
      color: rgb(177, 141, 141);
    }
  }
  </style>
  