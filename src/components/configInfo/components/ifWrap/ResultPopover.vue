<template>
    <div >
      <el-popover
        placement="top-start"
        title=""
        @after-enter="afterEnter"
        trigger="click"
        popper-class="config-result-popper-main"
      >
        <div class="config-error-main">
          <div class="flex">
            <div class="el-icon-info info-icon"></div>
            <div class="info-content">
              <div class="info-title">{{!isTrue?'不通过原因':'查看业务值'}}</div>
              <div class="info-content-line" v-if="!isTrue">
                {{ !currentResultData.executeResult?currentResultData.divisorName + '与规则不匹配':currentResultData.executeResult }}
              </div>
              <div
                class="info-content-line flex-v"
                v-for="(item, i) in currentVal.factorNumArr"
                :key="i"
              >
                <span class="line-label">{{ item.divisorName }}</span>
                ：
                <span class="line-content">
                  {{ item.divisorValue ||'无'}}
                </span>
              </div>
            </div>
          </div>
        </div>
        <el-button type="text" slot="reference" v-if="!isMode||!isTrue" size="mini">
          {{ !isTrue?'查看原因':'查看业务值' }}
        </el-button>
      </el-popover>
    </div>
  </template>
  <script>
  export default {
    props: {
      isTrue:{
  
      },
      isMode:{
  
      },
      currentResultData: {},
      currentVal: {},
    },
    data() {
      return {}
    },
    methods:{
      afterEnter(){
        console.log(this.currentResultData,'currentResultData')
      }
    }
  }
  </script>
  <style scoped lang="scss"></style>
  <style lang="scss">
  $bg-popper: #ebf5ff;
  .config-result-popper-main {
    background: $bg-popper;
    padding: 15px 60px 15px 20px;
    max-width: 1200px;
    .info-icon {
      color: #0079fe;
      font-size: 24px;
      margin-right: 15px;
    }
    .info-title {
      font-size: 16px;
      color: #666666;
      margin-bottom: 8px;
    }
    /*  .info-content {
      font-size: 14px;
      color: #999999;
      margin-bottom: 5px;
    
    } */
    .line-content{
      flex: 1;
      flex-wrap: wrap;
    }
    .info-content-line {
      font-size: 14px;
      color: #999999;
      align-items: flex-start;
      &:not(:last-child) {
        margin-bottom: 5px;
      }
    }
    .popper__arrow::after {
      border-top-color: $bg-popper !important;
    }
  }
  </style>
  