<template>
    <el-popover placement="top" trigger="hover" :disabled="disabled">
      <div class="ref-type-handler">
        <el-button
          type="primary"
          size="mini"
          @click="handlerAdd('condition')"
          :disabled="disabled"
        >
          添加条件
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="handlerAdd('ref')"
          :disabled="disabled"
        >
          添加联合条件
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="$emit('handlerDel')"
          v-show="showDel"
          :disabled="disabled"
        >
          删除
        </el-button>
      </div>
      <div slot="reference" class="ref-type-select ref-type-select-box">
  
        <div
          class="error-box"
          v-show="uuid && errorRule && errorRule.msg && errorRule.uuid === uuid"
        >
          {{ errorRule.msg }}
        </div>
        <el-select
          v-model="insideValue"
          placeholder="请选择"
          size="mini"
          class="ref-type-select"
          @change="handlerChange"
          :disabled="disabled"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </el-popover>
  </template>
  
  <script>
  export default {
    name: 'RefType',
    // 让父组件 v-model 传参
    model: {
      prop: 'refValue',
      event: 'change',
    },
    props: {
      errorRule: {},
      uuid: {},
      disabled: {},
      //是否展示删除按钮
      showDel: {
        type: Boolean,
        default: false,
      },
      refValue: {
        type: [Number, String],
        default: undefined,
      },
    },
    data() {
      return {
        visible: false,
        insideValue: undefined,
        options: [
          { label: '并且', value: 'and' },
          { label: '或者', value: 'or' },
        ],
      }
    },
    watch: {
      refValue: {
        // 若传入一个数字就显示。为空则不显示
        handler(newVlalue) {
          this.insideValue = newVlalue || 'and'
        },
        immediate: true,
      },
    },
    methods: {
      handlerChange(e) {
        this.$emit('change', e)
      },
      handlerAdd(sign) {
        this.$emit('clearValidate')
        this.$emit('handlerAdd', { sign })
      },
    },
  }
  </script>
  
  <style lang="scss" scoped>
  ::v-deep {
    .ref-type-select-box {
      position: relative;
      .error-box {
        position: absolute;
        color: red;
        font-size: 12px;
        bottom: -20px;
        width: 300px;
      }
    }
    //逻辑符
    .ref-type-select {
      width: 80px;
    }
  }
  </style>
  