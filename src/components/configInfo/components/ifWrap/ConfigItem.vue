<template>
    <div class="config-wrapper" :style="customStyle">
      <ConfigCondition
        v-if="item.sign === 'condition'"
        class="condition-line-item"
        :item="item"
        v-bind="$attrs"
        :disabled="disabled"
        v-on="$listeners"
      />
      <RefType
        @handlerAdd="handlerAdd"
        v-model="item.refType"
        @handlerDel="handlerDel"
        @clearValidate="$emit('clearValidate')"
        :disabled="disabled"
        :uuid="item.uuid"
        v-bind="$attrs"
        :showDel="item.conditions && item.conditions.length ? false : true"
        v-else
      ></RefType>
    </div>
  </template>
  <script>
  import RefType from './RefType.vue'
  import ConfigCondition from './ConfigCondition.vue'
  export default {
    components: {
      RefType,
      ConfigCondition,
    },
    props: {
      disabled: {},
      item: {
        type: Object,
        default: () => {},
      },
    },
    name: 'ConfigItem',
    data() {
      return {
        valueType: 'text',
        topHeight: 0,
      }
    },
    computed: {
      customStyle({ item, topHeight }) {
        let result = {}
        if (item && item.pos) {
          let [left, top] = item.pos
          result = {
            left: `${left}px`,
            top: `${top + topHeight}px`,
          }
        }
        return result
      },
    },
    watch: {},
    methods: {
      handlerDel() {
        this.$emit('handlerDel', { item: this.item })
      },
      handlerAdd({ sign }) {
        this.$emit('handlerAdd', { sign, item: this.item })
      },
    },
  }
  </script>
  <style scoped lang="scss">
  .config-wrapper {
    position: absolute;
    z-index: 1;
  
    ::v-deep {
      .mr5 {
        margin-right: 5px;
      }
      .condition-line-item {
        display: flex;
        position: relative;
        .error-box {
          position: absolute;
          color: red;
          font-size: 12px;
          bottom: -20px;
        }
        .rule-item-op {
          width: 100px;
        }
        .rule-item-select {
          width: 160px !important;
        }
        .rule-item-value {
          width: 160px !important;
          .el-input {
            width: 160px;
          }
        }
        //多选
        .rule-item-value-multiple {
          width: 240px !important;
          .el-input {
            width: 240px;
          }
          .el-tag {
            max-width: 140px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .rule-item-value-type {
          width: 90px !important;
          .el-input {
            width: 90px;
          }
        }
        .rule-del {
          font-size: 20px;
          margin-top: 3px;
        }
        .delete-btn {
          color: #4072ee;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          // align-items: center;
          margin-top: 2px;
          &:hover,
          &:active {
            color: #6890f4;
          }
        }
      }
    }
  }
  </style>
  