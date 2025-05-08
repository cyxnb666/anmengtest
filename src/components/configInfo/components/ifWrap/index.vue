<template>
    <div class="config-info-main-if-wrap">
      <div class="config-info-main-inner">
        <div :class="['rule-title-wrap', isThenWrap ? 'is-thenwrap' : '']">{{ conditionWrap }}</div>
        <div class="rule-content" :style="ruleStyle">
          <RefType
            v-model="config.refType"
            @change="handlerChange"
            @input="handlerChange"
            @handlerAdd="handlerAdd"
            :errorRule="errorRule"
            class="ref-type-and"
            v-bind="$attrs"
          ></RefType>
          <config-item
            v-for="(item, index) in flatData"
            :key="index"
            :item="item"
            :errorRule="errorRule"
            @handlerAdd="handlerAdd"
            @clearValidate="clearValidate"
            @handlerConditionAction="handlerConditionAction"
            v-bind="$attrs"
            :isResult="isResult"
            @handlerDel="handlerDel"
            ref="configItem"
          ></config-item>
          <div class="paper-container" :style="ruleContentStyle">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              class="svg-content"
              style="overflow: hidden; position: relative; left: -0.25px;"
            >
              <desc style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">Created with Raphaël 2.3.0</desc>
              <defs style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);" />
              <path
                fill="none"
                stroke="#bbbbbb"
                :d="item"
                transform="matrix(1,0,0,1,0,0)"
                style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"
                v-for="(item, i) in pathLineList"
                :key="i"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  import ConfigItem from "./ConfigItem";
  import RefType from "./RefType.vue";
  import { CalcPosition } from "../utils";
  import { deepClone } from "@/utils";
  import { getUuid } from "@/utils/tools";
  import emitter from "@/mixins/emitter";
  import { scrollTo } from "@/utils/scroll-to";
  
  export default {
    name: "IfWrap",
    componentName: "IfWrap",
    mixins: [emitter],
  
    props: {
      //初始化initIf
      initIf: {},
      //初始化initRefType
      initRefType: {},
      ruleName: {},
      conditionWrap: {
        type: String,
        default: "If"
      },
      //是否为结果页
      isResult: {},
      config: {
        type: Object,
        required: true,
        default: () => {
          return {
            pos: [0, 0],
            refType: "and",
            conditions: []
          };
        }
      }
    },
    components: {
      ConfigItem,
      RefType
    },
    created() {
      this.dispatch("CustomForm", "custom.form.addField", [this]);
      this.treeInstance = new CalcPosition();
    },
    beforeDestroy() {
      this.dispatch("CustomForm", "custom.form.removeField", [this]);
    },
    data() {
      return {
        errorRule: {},
        treeInstance: null, //处理数据的实例
        ruleContentHeight: 50,
        ruleContentWidth:50,
        value: "",
        pathLineList: [], //曲线path路径
        flatData: [] //展示数据
      };
    },
    computed: {
      ruleStyle({ ruleContentHeight }) {
        return {
          height: ruleContentHeight + "px"
        };
      },
       ruleContentStyle({ ruleContentWidth }) {
        return {
          width: ruleContentWidth + "px",
        };
      },
      isThenWrap({ conditionWrap }) {
        conditionWrap = conditionWrap.toLowerCase();
        return conditionWrap == "then";
      }
    },
    methods: {
      handlerChange(e) {
        this.config.refType = e;
      },
      isNotEmpty(val) {
        if (typeof val === "number") {
          return val === 0 || val ? true : false;
        } else {
          return val;
        }
      },
      clearValidate() {
        if (Object.keys(this.errorRule).length) {
          this.errorRule = {};
        }
      },
      validateForm() {
        //校验条件
        return new Promise((resolve, reject) => {
          let errors = [];
          this.clearValidate();
          console.log(this.flatData, "flatData");
          for (let i = 0; i < this.flatData.length; i++) {
            const item = this.flatData[i];
            let {
              sign,
              left,
              functionName,
              value,
              opConfig,
              conditions,
              valueType
            } = item;
            let flag = false;
            let msg = "";
            if (sign === "ref") {
              //校验连接符
              if (!conditions?.length) {
                flag = true;
                msg = "连接符尚未添加条件";
              }
            } else {
              let { content = "" } = left;
              //校验左边因子选择
              if (!content) {
                flag = true;
                msg = "因子不能为空";
              } else {
                let { content, contentList } = value;
                //校验右边输入值
                if (
                  !opConfig.noValue &&
                  valueType !== "noRightValue" &&
                  !item.noRightValue
                ) {
                  if (opConfig.multiple && !contentList?.length) {
                    flag = true;
                    msg = "值不能为空";
                  }
                  if (!opConfig.multiple && !this.isNotEmpty(content)) {
                    flag = true;
                    msg = "值不能为空";
                  }
                }
                if (opConfig.value == "function" && !functionName.content) {
                  flag = true;
                  msg = "函数名不能为空";
                }
              }
            }
            if (flag) {
              errors.push(deepClone({ ...item, msg, index: i }));
              break;
            }
          }
          console.log(errors, "errors");
          if (errors.length) {
            let { msg, uuid, index } = errors[0];
            let $el = this.$refs?.configItem[index]?.$el;
            console.dir($el, "$el");
            let offsetTop = $el.offsetTop;
            this.$emit("scrollToRule", offsetTop);
            this.errorRule = {
              msg,
              uuid
            };
          }
          let hasNoValid = errors.length ? true : false;
          if (hasNoValid) {
            reject(this.ruleName);
          } else {
            resolve(this.flatData);
          }
        });
      },
      // 删除条件
      handlerDel({ item }) {
        this.treeInstance.removeItem(this.config.conditions, item.key);
        this.setContentVal();
      },
      calcPosition(arr) {
        return this.treeInstance.setPos(arr, this.isResult);
      },
      // 动态设置内容高度
      setContentVal() {
        let { flatData, pathLineList } = this.calcPosition(
          this.config.conditions,
          this.isResult
        );
        this.flatData = flatData;
        this.pathLineList = pathLineList;
        if (this.flatData.length) {
          let endItem = this.flatData[this.flatData.length - 1];
          let [x, y] = endItem.pos;
          let actionHeight = endItem.actionHeight || 0;
          this.ruleContentWidth = x + 200;
          this.ruleContentHeight = y + 50 + actionHeight;
        }
      },
      //添加动作
      handlerConditionAction({ sign, item }) {
        this.setContentVal();
      },
      //添加条件
      handlerAdd({ sign, item }) {
        let left = 120;
        let condition = {};
        //添加条件
        if (sign === "condition") {
          let initIf = deepClone(this.initIf);
          initIf.pos = [left, 0];
          condition = initIf;
          condition.uuid = getUuid();
        } else {
          //添加联合条件
          let initRefType = deepClone(this.initRefType);
          initRefType.pos = [left, 0];
          initRefType.sign = sign;
          condition = initRefType;
          condition.uuid = getUuid();
        }
        console.log(condition, "conditioncondition");
        //添加一级条件
        if (!item) {
          this.config.conditions.push(condition);
        } else {
          item.conditions.push(condition);
        }
  
        this.setContentVal();
      }
    }
  };
  </script>
  <style scoped lang="scss">
  .config-info-main-if-wrap {
    .config-info-main-inner {
      display: flex;
      font-size: 12px;
      ::v-deep {
        /* .el-input,
        .el-select {
          width: 100%;
        } */
        //if/then样式
        .rule-title-wrap {
          background: #4072ee;
  
          width: 40px;
          height: 40px;
          font-size: 16px;
          color: #fff;
          border-radius: 40px;
          text-align: center;
          line-height: 40px;
          float: left;
          margin: 8px;
          cursor: pointer;
        }
        .is-thenwrap {
          background: #49e4a9;
        }
        //条件内容
        .rule-content {
          margin: 17px 10px 10px 10px;
          min-height: 50px;
          position: relative;
          overflow-x: auto;
          overflow-y: hidden;
          width: 100%;
        }
        //逻辑符
        .ref-type-select {
          width: 80px;
        }
      }
    }
    .line-main {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
    }
    .paper-container {
      position: absolute;
      z-index: 0;
      width: 100%;
      height: 100%;
      top: 0;
      .svg-content {
        height: 100%;
        width: 100%;
      }
    }
    .ref-type-and {
      position: relative;
      z-index: 1;
    }
  }
  </style>
  