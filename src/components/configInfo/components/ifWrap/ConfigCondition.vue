<template>
    <div>
      <div
        v-if="item.sign === 'condition'"
        class="condition-line-item"
      >
        <div
          class="error-box"
          v-show="errorRule && errorRule.msg && errorRule.uuid === item.uuid"
        >
          {{ errorRule.msg }}
        </div>
        <el-select
          v-model="item.left.content"
          placeholder="请选择规则因子"
          size="mini"
          filterable
          :disabled="disabled"
          class="rule-item-select mr5"
          @change="clearValidate"
          :title="item.left.divisorName + '_' + item.left.content"
        >
          <el-option
            v-for="it in factorOptions"
            :key="it.id"
            :label="it.divisorName"
            :value="it.divisorCode"
          ></el-option>
        </el-select>
        <el-select
          v-model="item.op"
          placeholder="请选择比较操作符"
          size="mini"
          filterable
          @change="handlerChangeOpOn"
          :disabled="disabled"
          class="rule-item-op mr5"
        >
          <el-option
            v-for="it in opOptions"
            :key="it.value"
            :label="it.label"
            :value="it.value"
          ></el-option>
        </el-select>
        <!-- 函数名 -->
        <div
          v-if="!item.opConfig.noValue"
          class="flex"
        >
          <el-select
            v-model="item.functionName.content"
            placeholder="请选择函数/方法名"
            size="mini"
            filterable
            :disabled="disabled"
            @change="clearValidate"
            :title="item.functionName.targetFunctionName"
            v-if="item.op === 'function'"
            class="rule-item-value mr5"
          >
            <!-- 添加动作 -->
            <svg-icon
              icon-class="menu"
              @click.stop="addAction"
              slot="prefix"
              v-if="!disabled"
              class="prefix-icon"
            />
            <el-option
              v-for="it in functionOptions"
              :key="it.id"
              :label="it.targetFunctionName"
              :value="it.methodName"
            ></el-option>
          </el-select>
          <!-- 值的类型 -->
          <div :class="[item.conditionAction&&!isResult ? 'action-box' : '']">
            <div :class="['flex-v',!isResult?'condition-select-line':'']">
              <!-- 值的类型 -->
              <el-select
                filterable
                v-model="item.valueType"
                size="mini"
                class="rule-item-value-type mr5 "
                placeholder="请选择值的类型"
                @change="handlerChangeValueType"
                :disabled="disabled"
                v-show="!isResult"
              >
                <el-option
                  v-for="it in valueTypeShowOptions"
                  :key="it.value"
                  :label="it.label"
                  :value="it.value"
                ></el-option>
              </el-select>
              <!-- 输入值 -->
  
              <div v-if="!isNorightValue">
                <div
                  v-if="item.valueType && item.valueType === 'text'"
                  class="input-box"
                >
                  <el-input
                    v-model.trim="item.value.content"
                    clearable
                    size="mini"
                    class="rule-item-value mr5"
                    v-if="!item.opConfig.valueTextType"
                    placeholder="请输入"
                    :disabled="disabled"
                    @input="clearValidate"
                    :maxlength="item.maxlength || 100"
                  ></el-input>
                  <!-- 数字类型 -->
                  <input-number
                    size="mini"
                    placeholder="请输入数字"
                    class="rule-item-value mr5"
                    v-model.trim="item.value.content"
                    :disabled="disabled"
                    @input="clearValidate"
                    v-if="item.opConfig.valueTextType == 'number'"
                    clearable
                  ></input-number>
                </div>
                <!-- 常量、布尔值、因子 -->
                <!-- 多选 -->
                <el-select
                  v-else-if="item.opConfig.multiple"
                  filterable
                  clearable
                  multiple
                  v-model="item.value.contentList"
                  size="mini"
                  class="rule-item-value-multiple mr5"
                  placeholder="请选择"
                  :disabled="disabled"
                  @change="clearValidate"
                  collapse-tags
                  :title="getTitle(valueOptions, item.value.contentList, true)"
                >
                  <el-option
                    v-for="it in valueOptions"
                    :key="getKeys(it, item.valueType, 'value')"
                    :label="getKeys(it, item.valueType)"
                    :value="getKeys(it, item.valueType, 'value')"
                  ></el-option>
                </el-select>
                <!-- 单选 -->
                <el-select
                  v-else
                  filterable
                  clearable
                  v-model="item.value.content"
                  size="mini"
                  class="rule-item-value mr5"
                  placeholder="请选择"
                  :disabled="disabled"
                  @change="clearValidate"
                  :title="getTitle(valueOptions, item.value.content)"
                >
                  <el-option
                    v-for="it in valueOptions"
                    :key="getKeys(it, item.valueType, 'value')"
                    :label="getKeys(it, item.valueType)"
                    :value="getKeys(it, item.valueType, 'value')"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <!-- 延期单证动作 -->
            <div
              v-show="item.conditionAction"
              class="condition-action-line flex-v"
            >
              <el-select
                filterable
                v-model="item.conditionAction"
                size="mini"
                class="rule-item-value mr5"
                placeholder="请选择"
                title="该类型图片缺失时执行延期单证"
                :disabled="disabled"
              >
                <el-option
                  v-for="it in actionOptions"
                  :key="it.value"
                  :label="it.label"
                  :value="it.value"
                ></el-option>
              </el-select>
              <i
                @click="handlerDelAction"
                v-if="!disabled"
                class="el-icon-delete delete-action-btn"
              ></i>
            </div>
          </div>
        </div>
        <el-select
    v-model="item.divisorFailAction"
    size="mini"
    class="handle-type-select mr5"
    placeholder="请选择处理方式"
    :disabled="disabled"
  >
    <el-option
      v-for="option in handleTypeOptions"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
        <i
          @click="handlerDel"
          v-if="!disabled"
          class="el-icon-delete delete-btn"
        ></i>
        <ResultItem
          v-if="isResult"
          :item="item"
          v-bind="$attrs"
          :factorOptions="factorOptions"
          :constantOptions="constantOptions"
        />
      </div>
    </div>
  </template>
  <script>
  import { opOptions, valueTypeOptions, actionOptions } from "@/config/rule";
  import { judgeOptions } from "@/config/options";
  import { getObjLabel, getObjData } from "@/utils/tools";
  import { deepClone } from "@/utils";
  import ResultItem from "./ResultItem.vue";
  
  export default {
    components: {
      ResultItem,
    },
    props: {
      //是否展示结果
      isResult: {
        type: Boolean,
        default: false,
      },
      errorRule: {},
      disabled: {},
      //因子
      factorOptions: {},
      //函数
      functionOptions: {},
      //常量
      constantOptions: {},
      item: {
        type: Object,
        default: () => {},
      },
    },
    name: "ConfigItem",
    data() {
      return {
        actionOptions,
        valueType: "text",
        topHeight: 0,
        //操作符
        opOptions,
        noRightValueArr: ["hasVal", "isVal", "noVal"],
        defaultValueProp: {
          factor: {
            label: "divisorName",
            value: "divisorCode",
          },
          const: {
            label: "constantName",
            value: "constantKey",
          },
        },
        handleTypeOptions: [
      {
        label: '人工处理',
        value: 'manual'
      },
      {
        label: '非人工处理',
        value: 'auto'
      }
    ],
      };
    },
    computed: {
      //不需要值
      isNorightValue({ item, noRightValueArr }) {
        return (
          item.valueType === "noRightValue" ||
          noRightValueArr.includes(item.valueType) ||
          item.noRightValue
        );
      },
      customStyle({ item, topHeight }) {
        let result = {};
        if (item && item.pos) {
          let [left, top] = item.pos;
          result = {
            left: `${left}px`,
            top: `${top + topHeight}px`,
          };
        }
        return result;
      },
      // 选择的值options
      valueOptions({ factorOptions, item, constantOptions }) {
        let valueType = item.valueType;
        const obj = {
          text: [],
          const: constantOptions,
          bool: judgeOptions,
          factor: factorOptions,
        };
        return obj[valueType] || [];
      },
      //值的类型
      valueTypeShowOptions({ item }) {
        let opConfig = item.opConfig;
        let reslut = deepClone(valueTypeOptions);
        if (opConfig.valueOptions) {
          reslut = valueTypeOptions.filter((v) =>
            opConfig.valueOptions.includes(v.value)
          );
        }
        return reslut;
      },
    },
    watch: {
      factorOptions: {
        handler(val) {
          if (val && val.length) {
            this.handlerChangeLeft();
            this.handlerChangeFactor();
          }
        },
        immediate: true,
        deep: true,
      },
      constantOptions: {
        handler(val) {
          if (val?.length) {
            this.handlerChangeConst();
          }
        },
        immediate: true,
        deep: true,
      },
      functionOptions: {
        handler(val) {
          if (val?.length) {
            this.handlerChangeFun();
            this.handlerChangeFunOptions();
          }
        },
        immediate: true,
        deep: true,
      },
      "item.left.content": {
        handler(val) {
          if (val) {
            this.handlerChangeLeft();
          }
        },
        immediate: true,
      },
      "item.op": {
        handler(val, oldVal) {
          if (val) {
            let isChange = oldVal ? true : false;
            this.handlerChangeOp(isChange);
          }
        },
        immediate: true,
      },
      "item.functionName.content": {
        handler(val) {
          if (val) {
            this.handlerChangeFun();
          }
        },
        immediate: true,
      },
      //值的改变
      "item.value.content": {
        handler(val) {
          if (val) this.handlerValue(val);
        },
        immediate: true,
      },
      "item.value.contentList": {
        handler(val) {
          if (val) this.handlerValue(val);
        },
        immediate: true,
        deep: true,
      },
    },
    methods: {
      //添加延期动作
      addAction() {
        this.item.actionHeight = 40;
        this.item.conditionAction = "delay";
        this.$forceUpdate();
        this.$emit("handlerConditionAction", { item: this.item, sign: "add" });
      },
      handlerDelAction() {
        this.item.actionHeight = 0;
        this.item.conditionAction = "";
        this.$forceUpdate();
        this.$emit("handlerConditionAction", { item: this.item, sign: "del" });
      },
      clearValidate() {
        this.$emit("clearValidate");
      },
      getTitle(arr = [], val, isArr = false,noSign=false) {
        let result = "";
        let getValue = this.item.value.getValue;
        let isConst = this.item.valueType === "const";
        let { label, value } = this.getDefaultProp(this.item.valueType);
        result = getObjLabel({
          val,
          isArr,
          arr,
          label,
          value,
          otherParam: isArr && isConst&&!noSign ? "constantValue" : "",
        });
  
        if (!isArr && val&&!noSign) {
          let str = result + "_" + val;
          if (isConst && getValue) {
            str = `${result}(${getValue})`;
          }
          return str;
        }
        return result;
      },
      //值的类型
      handlerChangeValueType(e) {
        let hasItem = valueTypeOptions.find((v) => v.value == e);
        this.item.value = {
          content: "",
        };
        this.item.noRightValue = hasItem.noRightValue;
      },
      //获取值的类型的Keys
      getKeys(it, valueType, sign = "label") {
        let { label, value } = this.getDefaultProp(valueType);
        let obj = { label: it[label], value: it[value] };
        return obj[sign];
      },
      getDefaultProp(type) {
        let { label = "label", value = "value" } =
          this.defaultValueProp[type] || {};
        return { label, value };
      },
      handlerChangeFunOptions() {
        this.$nextTick(() => {
          let { op, valueType, opConfig = {}, functionName } = this.item;
          if (op === "function") {
            this.item.functionName.content = this.getCurVal({
              val: functionName.content,
              arr: this.functionOptions,
              value: "methodName",
            });
          }
        });
      },
      handlerChangeConst() {
        this.$nextTick(() => {
          let { op, valueType, opConfig = {} } = this.item;
          let { content, contentList } = this.item.value;
          let val = opConfig.multiple ? deepClone(contentList) : content;
          let isArr = opConfig.multiple;
          let key = isArr ? "contentList" : "content";
          if (valueType === "const") {
            this.item.value[key] = this.getCurVal({
              val,
              arr: this.constantOptions,
              value: "constantKey",
              isArr,
            });
          }
        });
      },
      handlerChangeFactor() {
        this.$nextTick(() => {
          let leftContent = this.item.left.content;
          let { op, valueType, opConfig = {} } = this.item;
          let { content, contentList } = this.item.value;
          let val = opConfig.multiple ? deepClone(contentList) : content;
          let isArr = opConfig.multiple;
          let key = isArr ? "contentList" : "content";
          this.item.left.content = this.getCurVal({
            val: leftContent,
            arr: this.factorOptions,
          });
          if (valueType === "factor") {
            this.item.value[key] = this.getCurVal({
              val,
              arr: this.factorOptions,
              isArr,
            });
          }
        });
      },
      getCurVal({
        val,
        arr,
        isArr = false,
        value = "divisorCode",
        label = "divisorName",
      }) {
        if (isArr) {
          let result = deepClone(val);
          if (val.length) {
            let resultArr = [];
            arr.forEach((v) => {
              if (val.includes(v[value])) {
                resultArr.push(v[value]);
              }
            });
            result = resultArr;
          }
          return result;
        } else {
          let result = val;
          if (val) {
            let hasItem = arr.find((v) => v[value] == val) || {};
            result = hasItem[value] || "";
          }
          return result;
        }
      },
      //left因子改变
      handlerChangeLeft() {
        let leftContent = this.item.left.content;
        let hasItem = getObjLabel(
          {
            val: leftContent,
            value: "divisorCode",
            label: "divisorName",
            arr: this.factorOptions,
          },
          true
        );
  
        if (hasItem) {
          const arr = ["divisorCode", "divisorName", "divisorType", "id"];
          this.item.left = {
            content: leftContent,
            ...getObjData(hasItem, arr),
          };
        }
      },
      // 函数名改变
      handlerChangeFun() {
        let fun = this.item.functionName.content;
        let hasItem = getObjLabel(
          {
            val: fun,
            value: "methodName",
            label: "targetFunctionName",
            arr: this.functionOptions,
          },
          true
        );
        if (hasItem) {
          const arr = [
            "classPath",
            "id",
            "methodName",
            "targetFunctionName",
            "targetFunctionStatus",
          ];
          this.item.functionName = {
            ...this.item.functionName,
            ...getObjData(hasItem, arr),
          };
        }
      },
      handlerChangeOpOn(e) {
        if (e === "function") {
          this.clearValidate();
          this.item.valueType = "hasVal";
          this.item.noRightValue = true;
          this.item.value.content = "";
        } else {
          this.item.noRightValue = false;
        }
      },
      //比较符改变
      handlerChangeOp(isChange) {
        let op = this.item.op;
        let valueType = this.item.valueType;
        let hasItem = opOptions.find((v) => v.value == op) || {};
        this.item.opConfig = hasItem;
  
        //不是函数类型
        if (op !== "function") {
          this.item.functionName = {
            content: "",
          };
        } else {
        }
        //为空、不为空
        if (this.item.opConfig.noValue) {
          this.item.value = {
            content: "",
            contentList: [],
            getValue: "",
          };
        }
        if (this.item?.opConfig?.multiple) {
          this.item.value = {
            content: "",
            ...this.item.value,
          };
        } else {
          this.item.value = {
            contentList: [],
            ...this.item.value,
          };
        }
        this.$nextTick(() => {
          let hasValueType = this.valueTypeShowOptions.find(
            (v) => v.value == valueType
          );
          if (!hasValueType) {
            this.item.valueType = this.valueTypeShowOptions[0].value;
            this.item.value = {
              content: "",
              contentList: [],
              getValue: "",
            };
          }
        });
      },
      //值的改变
      handlerValue() {
        this.$nextTick(() => {
          let { op, valueType, opConfig = {} } = this.item;
          let { content, contentList } = this.item.value;
          let arr = this.valueOptions;
          let val = opConfig.multiple ? deepClone(contentList) : content;
          let isArr = opConfig.multiple;
          //常量
          if (valueType === "const") {
            let { label, value } = this.getDefaultProp("const");
            let getValue = "";
            if (!isArr) {
              let hasItem = arr.find((v) => v[value] == val);
              if (hasItem) {
                getValue = hasItem.constantValue;
              }
            } else {
              let result = [];
              val.forEach((it) => {
                let hasItem = arr.find((v) => v[value] == it);
                if (hasItem) {
                  result.push(hasItem.constantValue);
                }
              });
              getValue = deepClone(result);
            }
            this.item.value.getValue = getValue;
            if (this.constantOptions.length) {
              this.item.value.labels = this.getTitle(
                this.constantOptions,
                val,
                isArr,
                true
              );
            }
          } else {
            if (valueType === "factor" && this.factorOptions.length) {
              this.item.value.labels = this.getTitle(
                this.factorOptions,
                val,
                isArr,
                true
              );
            }
            this.item.value.getValue = val;
          }
        });
      },
      handlerDel() {
        this.$emit("handlerDel", { item: this.item });
      },
      handlerAdd({ sign }) {
        this.$emit("handlerAdd", { sign, item: this.item });
      },
    },
  };
  </script>
  <style scoped lang="scss">
  .condition-line-item {
    .prefix-icon {
      font-size: 18px;
      margin: 5px 0 0 2px;
      cursor: pointer;
      color: $menuActiveText;
    }
    .action-box {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 5px;
    }
    .condition-select-line {
      margin-bottom: 5px;
    }
    .condition-action-line {
      // margin-top: 5px;
      .delete-action-btn {
        color: #000;
        font-size: 18px;
        cursor: pointer;
        display: flex;
        margin-top: 2px;
        &:hover,
        &:active {
          color: #3f3e3e;
        }
      }
    }
  }
  </style>
  