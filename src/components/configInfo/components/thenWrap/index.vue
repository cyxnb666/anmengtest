<template>
    <div class="config-info-main-then-wrap">
      <div class="config-info-main-inner">
        <div :class="['rule-title-wrap',isThenWrap?'is-thenwrap':'']">
          {{conditionWrap}}
        </div>
        <div class="rule-content">
          <!-- <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
          >添加动作</el-button> -->
          <div v-for="(item,i) in thenData.actions" :key="i" class="award-line">
            <span class="award-label">执行：</span>
            <input-number v-model="item.value.content" :disabled="disabled" :max="9999999999"></input-number>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  export default {
    props: {
      disabled:{
  
      },
      thenData:{
        type:Object,
        default:()=>{}
      },
      conditionWrap: {
        type: String,
        default: "Then",
      },
    },
    computed: {
      isThenWrap({ conditionWrap }) {
        conditionWrap = conditionWrap.toLowerCase();
        return conditionWrap == "then";
      },
    },
    data() {
      return {};
    },
  };
  </script>
  <style scoped lang='scss'>
  .config-info-main-then-wrap {
    .config-info-main-inner {
      display: flex;
      font-size: 12px;
      ::v-deep {
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
          // border: #4072ee 1px solid;
          width: 100%;
        }
        .award-line{
          display: flex;
          align-items: center;
          .award-label{
            margin-right: 10px;
          }
        }
      }
    }
  }
  </style>