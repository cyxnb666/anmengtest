<template>
    <el-option
      :style="`width: ${width}px`"
      :label="label"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-tooltip
        :disabled="showLabel&&showLabel.length<limitLength"
        :placement="placement"
        effect="light"
        :content="showLabel"
      >
        <div class="drop-item-label"> {{ showLabel }} </div>
      </el-tooltip>
      <slot />
    </el-option>
  </template>
  
  <script>
  export default {
    name: "TOption",
    props: {
      // 宽度
      width: {
        type: [Number, String],
        default: 230,
      },
      label: {
        type: [String, Number],
        default: "",
      },
      tipLabel: {
        type: [String, Number],
        default: "",
      },
      // 提示框出现位置
      placement: {
        type: String,
        default: "right",
      },
      limitLength:{
        type:Number,
        defaul:50
      }
    },
    computed:{
      showLabel({tipLabel,label}){
        return tipLabel||label
      }
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
  