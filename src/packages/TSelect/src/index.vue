<template>
    <el-select
      v-model="insideValue"
      placeholder="请选择"
      style="width:240px"
      v-on="$listeners"
      v-bind="$attrs"
    >
      <!-- <t-option
        v-for="item in informNameList"
        :key="item.informCode"
        :label="item.informName"
        :tip-label="item.informName+'-'+item.informCode"
        :value="item.informCode"
      /> -->
      <slot></slot>
    </el-select>
  </template>
  
  <script>
  export default {
    name: "TSelect",
    model: {
      prop: "selectValue",
      event: "change",
    },
    props: {
      selectValue: {
        type: [Number, String],
        default: undefined,
      },
    },
    data() {
      return {
        insideValue: "",
      };
    },
    watch: {
      numberValue: {
        // 若传入一个数字就显示。为空则不显示
        handler(newVlalue) {
          this.insideValue = newVlalue;
        },
        immediate: true,
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .drop-item-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>
  