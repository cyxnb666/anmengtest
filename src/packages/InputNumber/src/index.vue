<template>
    <el-input-number
      id="InputNumber"
      v-model="insideValue"
      v-bind="$attrs"
      :size="size"
      :controls="controls"
      v-on="$listeners"
    />
  </template>
  
  <script>
  export default {
    name: "InputNumber",
    // 让父组件 v-model 传参
    model: {
      prop: "numberValue",
      event: "change",
    },
    props: {
      size:{
        default:'mini'
      },
      empty: {
        default: false,
      },
      numberValue: {
        type: [Number, String],
        default: undefined,
      },
      // 默认不显示控制按钮，这个可以根据实际情况做调整
      controls: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        insideValue: undefined,
      };
    },
    watch: {
      numberValue: {
        // 若传入一个数字就显示。为空则不显示
        handler(newVlalue) {
          if (typeof newVlalue === "number" || !isNaN(newVlalue)) {
            this.insideValue = newVlalue;
          } else {
            this.insideValue = undefined;
          }
          if (newVlalue === "") {
            this.insideValue = undefined;
          }
        },
        immediate: true,
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  #InputNumber {
    ::v-deep .el-input__inner {
      text-align: left;
    }
  }
  </style>
  