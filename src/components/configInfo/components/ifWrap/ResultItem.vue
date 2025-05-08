<template>
    <div class="flex-v config-condition-item-result">
      <i :class="[
        isStatusTrue
          ? 'el-icon-success success-icon'
          : 'el-icon-error error-icon',
        'result-icon',
      ]" v-if="currentResultData"></i>
      <span v-if="isDev && currentResultData" class="exec-flag-span">{{ currentResultData.execFlag }}</span>
      <div v-if="currentResultData">
        <div v-if="!isFun">
          <ResultPopover :currentResultData="currentResultData" :currentVal="currentVal" :isTrue="isStatusTrue" />
        </div>
        <el-button type="text" v-else @click="handlerView('error')" size="mini">
          {{ isStatusTrue ? '查看业务值' : '查看原因' }}
        </el-button>
      </div>
      <ResultImgItem v-if="visible" v-model="visible" :isTrue="isStatusTrue" :currentVal="currentVal"
        :handlerSign="handlerSign" :currentResultData="currentResultData" />
    </div>
  </template>
  <script>
  import ResultImgItem from './ResultImgItem'
  import { getObjLabel, isJSON } from '@/utils/tools'
  import ResultPopover from './ResultPopover'
  export default {
    props: {
      item: {},
      constantOptions: {},
      factorOptions: {},
      //结果集
      resultDataList: {
        type: Array,
        default: () => [],
      },
    },
    components: {
      ResultImgItem,
      ResultPopover,
    },
    computed: {
      currentResultData({ resultDataList = [], item }) {
        return resultDataList.find((v) => v.ruleUuid == item.uuid)
      },
      isFun({ item }) {
        return item.op === 'function'
      },
      isStatusTrue({ currentResultData }) {
        return currentResultData.executeStatus == '1'
      },
    },
    watch: {
      currentResultData: {
        handler(val) {
          if (val) {
            this.handlerGetVal()
          }
        },
        immediate: true,
        deep: true,
      },
      factorOptions: {
        handler(val) {
          if (val && val.length) {
            this.handlerGetVal()
          }
        },
        immediate: true,
        deep: true,
      },
      constantOptions: {
        handler(val) {
          if (val?.length) {
            this.handlerGetVal()
          }
        },
        immediate: true,
        deep: true,
      },
    },
    data() {
      return {
        visible: false,
        handlerSign: '',
        currentVal: {},
        defaultValueProp: {
          factor: {
            label: 'divisorName',
            value: 'divisorCode',
          },
          const: {
            label: 'constantName',
            value: 'constantKey',
          },
        },
      }
    },
    methods: {
      getDefaultProp(type) {
        let { label = 'label', value = 'value' } =
          this.defaultValueProp[type] || {}
        return { label, value }
      },
      handlerGetVal() {
        let { constantOptions, factorOptions, currentResultData } = this
        let { valueType, opConfig, op } = this.item
        if (
          currentResultData &&
          factorOptions?.length &&
          constantOptions?.length
        ) {
          let {
            serviceValue,
            imgIdList,
            divisorCode,
            divisorName,
            serviceRightValue,
          } = currentResultData
  
          //左边因子
          let leftVal = {
            divisorName,
            divisorCode,
            divisorValue: serviceValue,
          }
          //右边因子、常量
          let isFactor = valueType === 'factor'
          let isConst = valueType === 'const'
          let isArr = opConfig.multiple
          let configList = []
          if (isFactor || isConst) {
            let { label, value } = this.getDefaultProp(valueType)
            let val = isArr
              ? this.item.value.contentList
              : this.item.value.content
            let result = getObjLabel(
              {
                label,
                value,
                val,
                arr: isFactor ? factorOptions : constantOptions,
                isArr,
              },
              true,
            )
            let rightVal = serviceRightValue || ''
            if (isArr) {
              if (rightVal && isJSON(rightVal)) {
                let rightValArr = JSON.parse(rightVal)
                result.forEach((it, i) => {
                  configList.push({
                    divisorName: it[label],
                    divisorCode: it[value],
                    divisorValue: rightValArr[i],
                  })
                })
              }
            } else {
              if (result && Object.keys(result).length && rightVal) {
                configList = [
                  {
                    divisorName: result[label],
                    divisorCode: result[value],
                    divisorValue: rightVal,
                  },
                ]
              }
            }
          }
  
          let factorNumArr = []
          if (!configList?.length) {
            factorNumArr.push({
              divisorName: '当前业务值',
              divisorValue: leftVal.divisorValue,
            })
          } else {
            let arr = [leftVal, ...configList]
            factorNumArr = arr.map((v) => {
              return {
                divisorName: `当前${v.divisorName}业务值`,
                divisorCode: v.divisorCode,
                divisorValue: v.divisorValue,
              }
            })
          }
          if (op === 'function' && valueType === 'text') {
            factorNumArr.push({
              divisorName: `函数阈值`,
              divisorValue: this.item.value.content,
            })
          }
          factorNumArr.forEach((it) => {
            let val = it.divisorValue
            if (!this.isImageData(it.divisorValue)) {
              if (val && isJSON(val)) {
                val = JSON.parse(val)
              }
              if (val && Array.isArray(val)) {
                it.divisorValue = val.join('、')
              }
            }
          })
          this.currentVal = {
            leftVal,
            factorNumArr: factorNumArr.filter((v) => {
              return !this.isImageData(v.divisorValue)
            }),
          }
        }
      },
      isImageData(val) {
        let str = val
        if (val && typeof val == 'object') {
          str = JSON.stringify(val)
        }
        return str && str.indexOf('/Image/fileview') != -1
      },
      handlerView(sign) {
        console.log(this.currentResultData, 'currentResultData')
        this.handlerSign = sign
        this.visible = true
      },
      isTrue(status) {
        return status === '1'
      },
    },
  }
  </script>
  <style scoped lang="scss">
  .config-condition-item-result {
    .result-icon {
      font-size: 16px;
      display: flex;
      align-items: center;
      margin-right: 2px;
    }
  
    .error-icon {
      color: rgba(255, 87, 87, 1);
    }
  
    .success-icon {
      color: rgba(0, 184, 128, 1);
    }
  
    .exec-flag-span {
      color: red;
      font-weight: bold;
      margin: 0 5px;
    }
  }
  </style>
  