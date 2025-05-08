<template>
    <div class="config-info-main-box">
      <!-- IF -->
      <el-card class="if-card" ref="if">
        <slot></slot>
        <if-wrap
          :initIf="initIf"
          :initRefType="initRefType"
          :config="configData.if"
          v-bind="$attrs"
          @scrollToRule="(e)=>scrollToCon('if',0,e)"
          :disabled="disabled"
          ref="ifWrap"
        >
        </if-wrap>
        <then-wrap
          :thenData="configData.then"
          v-bind="$attrs"
          :disabled="disabled"
          v-if="!hideThen(configData)"
        ></then-wrap>
      </el-card>
      <el-button
        :class="{ 'add-condition-btn': true, 'is-disabled-common': disabled }"
        @click="handlerAddCondition"
        :disabled="disabled"
        v-show="!disabled"
        v-if="needElseIf"
      >
        <i class="el-icon-plus add-icon"></i>
        添加条件
      </el-button>
      <!-- ElseIf -->
      <el-card
        class="if-card else-if-item"
        v-for="(item, i) in configData.elseIf"
        :key="i"
        ref="elseIf"
      >
        <i
          class="el-icon-delete delete-wrap-icon"
          @click="handlerDelCondition(i)"
        ></i>
        <slot></slot>
  
        <if-wrap
          :initIf="initIf"
          :initRefType="initRefType"
          conditionWrap="ElseIf"
          :config="item.if"
          v-bind="$attrs"
          ref="elseWrap"
          @scrollToRule="(e)=>scrollToCon('elseIf',i,e)"
          :disabled="disabled"
        ></if-wrap>
        <then-wrap
          :thenData="item.then"
          v-bind="$attrs"
          :disabled="disabled"
          v-if="!hideThen(configData)"
        ></then-wrap>
      </el-card>
      <!--  <el-card>
        <then-wrap conditionWrap="else"></then-wrap>
      </el-card> -->
    </div>
  </template>
  <script>
  import IfWrap from './ifWrap'
  import ThenWrap from './thenWrap'
  import { deepClone } from '@/utils'
  import { scrollTo } from '@/utils/scroll-to'
  
  export default {
    props: {
      needElseIf:{
        default:false
      },
      disabled: {},
      //规则类型
      configType: {
        type: Number,
      },
      configData: {
        type: Object,
        default: () => {
          return {
            if: {
              pos: [0, 0],
              refType: 'and',
              conditions: [],
            },
            then: {
              actions: [
                {
                  value: {
                    type: 'integral',
                    content: '',
                  },
                },
              ],
            },
            elseIf: [],
          }
        },
      },
    },
    components: {
      IfWrap,
      ThenWrap,
    },
  
    data() {
      return {
        noThen: [1, 2],
        //初始化if
        initIf: {
          left: {
            content: '',
            label: '',
            type: '',
          },
          valueType: 'text',
          opConfig: {}, //比较符配置
          uuid: '',
          functionName: {
            //函数名
            content: '',
            classPath: '',
            methodName: '',
          },
          op: 'eq',
          conditionAction:'',//条件动作,delay，延期单证
          actionHeight:0,//条件高度
          noRightValue:false,//没有右边的输入值
          divisorFailAction: '',
          value: {
            content: '',
            contentList: [],//多选时
            getValue: '',//传给后端的具体值
          },
          pos: [0, 0],
          sign: 'condition',
        },
        //初始化逻辑符
        initRefType: {
          refType: 'and',
          pos: [0, 0],
          childLength: 0,
          sign: 'ref',
          conditions: [],
        },
        //初始化条件
        initElse: {
          if: {
            pos: [0, 0],
            refType: 'and',
            conditions: [],
          },
          then: {
            actions: [
              {
                value: {
                  type: 'integral',
                  content: '',
                },
              },
            ],
          },
        },
      }
    },
    methods: {
      //滚动到条件
      scrollToCon(sign = 'if', index = 0,top=0) {
        // console.log()
        let offsetTop = 0
        if (sign == 'if') {
          offsetTop = this.$refs.if.$el.offsetTop
        } else {
          offsetTop = this.$refs.elseIf[index].$el.offsetTop
        }
        let topNum=offsetTop+top
        if (topNum) {
          scrollTo(topNum)
        }
      },
      hideThen() {
        return true
      },
      //删除条件
      handlerDelCondition(i) {
        this.configData.elseIf.splice(i, 1)
      },
      //添加条件
      handlerAddCondition() {
        this.configData.elseIf.push(deepClone(this.initElse))
      },
    },
  }
  </script>
  <style scoped lang="scss">
  .config-info-main-box {
    border-radius: 4px;
    background-color: #fafafa;
    border: 1px solid #d9d9d9;
    padding: 15px;
    .crad-content {
      padding: 20px;
    }
    ::v-deep {
      .if-card {
        margin-bottom: 10px;
      }
      .add-icon {
        font-weight: bold;
        margin-right: 10px;
      }
      .add-condition-btn {
        margin-bottom: 10px;
        width: 100%;
        position: relative;
        background-image: none;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        touch-action: manipulation;
        border-radius: 4px;
        border: 1px solid #d9d9d9;
        color: rgba(0, 0, 0, 0.65);
        background-color: #fff;
        border-color: #d9d9d9;
        border-style: dashed;
        &:hover,
        &:active {
          color: #6b99fa;
          background-color: #fff;
          border-color: #6b99fa;
        }
      }
    }
    .else-if-item {
      position: relative;
  
      .delete-wrap-icon {
        position: absolute;
        right: 22px;
        top: 20px;
        font-size: 18px;
        cursor: pointer;
        color: #827777;
        &:active,
        &:hover {
          color: rgb(106, 93, 93);
        }
      }
    }
  }
  </style>
  