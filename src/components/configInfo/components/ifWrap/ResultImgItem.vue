<template>
    <t-dialog
      v-bind="$attrs"
      v-on="$listeners"
      v-model="dialogVisible"
      width="1300px"
      :title="title"
      :closeOnClickModal="true"
      append-to-body
      :loading="loading"
      :footerSlot="true"
      class="result-img-item-main"
    >
      <div slot="title">
        <span>规则条件执行详情</span>
        <span
          :class="['status-button', !isTrue ? 'error-status' : 'success-status']"
        >{{ isTrue ? '通过' : '不通过' }}</span>
      </div>
      <div class="result-img-content">
        <!-- <div class="flex mb5" v-show="!isTrue||currentResultData.extendFlag=='1'">
          <div>{{currentResultData.extendFlag=='1'?'通过原因':'不通过原因'}}：</div>
          <div class="error-result" v-html="currentResultData.executeResult">
          </div>
        </div>-->
        <div class="flex mb5" v-show="currentResultData.executeResult!='通过'">
          <div>原因：</div>
          <div
            :class="['error-result',isTrue?'success-result':'']"
            v-html="currentResultData.executeResult"
          ></div>
        </div>
        <div class="flex-v info-content-line-box">
          <div class="flex-v mr20">
            <span>函数名</span>
            ：
            <span>{{ currentResultData.divisorName }}</span>
          </div>
          <div class="flex-v">
            <span>执行时间</span>
            ：
            <span>
              {{
              `${currentResultData.divisorStartDate}至${currentResultData.divisorEndDate}`
              }}
            </span>
          </div>
        </div>
        <div class="info-content-line-box">
          <div class="info-content-line flex-v" v-for="(item, i) in currentVal.factorNumArr" :key="i">
            <span class="line-label">{{ item.divisorName }}</span>
            ：
            <span class="line-content">{{ item.divisorValue || '无' }}</span>
          </div>
        </div>
        <div class="iamge-table-main" v-show="tableData && tableData.length">
          <!-- <div class="image-title">事故现场照片</div> -->
          <div class="image-table">
            <div
              :class="['table-item',item.appPhotosFlag=='false'?'recommend':'']"
              v-for="(item, index) in sliceTableData({
                tableData,
                currentPage: pagerConfig.currentPage,
                pageSize: pagerConfig.pageSize,
              })"
              :key="index"
            >
              <el-image
                class="table-item-img pdf-box"
                :src="item.url"
                :z-index="9999999"
                v-if="!item.isPdf"
                :preview-src-list="tableUrls"
              ></el-image>
              <div v-if="item.isPdf" class="pdf-box" @click="handlerOpen(item)">
                <pdfViewer ref="pdf" :src="item.url" class="table-item-img" />
              </div>
              <div
                @click="handlerDownPdf(item)"
                :class="[!item.isPdf ? 'file-name' : 'file-name file-name-pdf']"
              >{{ !item.isPdf?item.imgId:`${item.imgId}${item.ext}` }}</div>
            </div>
          </div>
          <!-- 分页 -->
          <div class="pagination-line">
            <el-pagination
              :current-page="pagerConfig.currentPage"
              :page-sizes="pageSizes"
              :page-size="pagerConfig.pageSize"
              :total="pagerConfig.total"
              :layout="layout"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </t-dialog>
  </template>
  <script>
  import { sliceTableData, downLoadByUrl, isJSON } from "@/utils/tools";
  import pdfViewer from "vue-pdf";
  
  export default {
    props: {
      visible: {},
      isTrue: {},
      currentVal: {},
      currentResultData: {
        type: Object,
        default: () => {}
      },
      handlerSign: {
        type: String,
        default: ""
      }
    },
    components: {
      pdfViewer
    },
    model: {
      prop: "visible",
      event: "change"
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        tableData: [],
        tableUrls: [],
        layout: "total, sizes, prev, pager, next, jumper",
        pageSizes: [8, 20, 50, 100],
        pagerConfig: {
          currentPage: 1,
          total: 0,
          pageSize: 8
        }
      };
    },
    computed: {
      title() {
        return `案件执行详情`;
      }
    },
    watch: {
      visible: {
        handler(val) {
          this.dialogVisible = val;
        },
        immediate: true
      },
      dialogVisible(val) {
        this.$emit("change", val);
      },
      currentResultData: {
        handler(val) {
          if (val) {
            this.$nextTick(() => {
              this.init();
            });
          }
        },
        immediate: true,
        deep: true
      }
    },
    mounted() {
      // 通过遮罩层关闭图片预览
      document.addEventListener("click", this.closeImg);
    },
    beforeDestroy() {
      document.removeEventListener("click", this.closeImg);
    },
    methods: {
      //分页
      sliceTableData,
      handlerDownPdf(item) {
        downLoadByUrl(`${item.url}&ShowType=file`, `${item.imgId}${item.ext}`);
      },
      //打开pdf
      handlerOpen(item) {
        window.open(item.url);
      },
      handleSizeChange(val) {
        this.pagerConfig.pageSize = val;
      },
      handleCurrentChange(val) {
        this.pagerConfig.currentPage = val;
      },
      init() {
        let result = [];
        let imgIdList = this.currentResultData.imgIdList;
        if (imgIdList) {
          result = isJSON(imgIdList) ? JSON.parse(imgIdList) : [];
        }
        console.log(result, "result");
        result.forEach(it => {
          it.isPdf = this.isPdf(it.ext);
          if (it.base64) {
            it.url = `data:image/png;base64,${it.base64}`;
          }
        });
        this.tableData = result;
        this.pagerConfig.total = result.length;
        this.tableUrls = result.filter(v => !v.isPdf).map(v => v.url);
      },
      isPdf(ext) {
        if (!ext) {
          return false;
        }
        let str = ext.toLowerCase();
        return str.includes("pdf");
      },
      closeImg(e) {
        if (e.target.className == "el-image-viewer__mask") {
          let close = document.querySelector(
            ".el-image-viewer__wrapper .el-icon-circle-close"
          );
          close.click();
        }
      }
    }
  };
  </script>
  <style scoped lang="scss">
  .result-img-item-main {
    .status-button {
      padding: 4px 5px;
      font-size: 12px;
      margin-left: 10px;
      border-radius: 5px;
    }
    .error-status {
      border: 1px solid #f78989;
      color: #f78989;
      background: #fef0f0;
    }
    .success-status {
      color: #85ce61;
      border: 1px solid #85ce61;
      background: #f0f9e8;
    }
    .mb5 {
      margin-bottom: 5px;
    }
    .result-img-content {
      font-size: 14px;
      .error-result {
        color: #f78989;
        flex: 1;
      }
      .success-result {
        // color: #00B880;
        color: #85ce61;
      }
      .info-content-line-box {
        margin-bottom: 5px;
        display: flex;
        .info-content-line {
          margin-right: 30px;
          .line-label {
            // flex: 1;
            max-width: 260px;
          }
          .line-content {
            // flex: 1;
            max-width: 700px;
          }
        }
      }
    }
    .iamge-table-main {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 20px 20px 20px;
      .image-title {
        font-size: 18px;
      }
      .image-table {
        display: flex;
        flex-wrap: wrap;
        ::v-deep {
          .table-item {
            margin: 10px 24px;
            text-align: center;
            width: 252px;
            .file-name-pdf {
              cursor: pointer;
              color: $menuActiveText;
              text-decoration: underline;
            }
            .pdf-box {
              border: 1px solid #ccc;
              cursor: pointer;
              border-radius: 4px;
              overflow: hidden;
            }
            .table-item-img {
              width: 100%;
              height: 150px;
              canvas {
                width: 100% !important;
                height: 100% !important;
              }
            }
            .file-name {
              font-size: 12px;
              margin-top: 10px;
            }
          }
        }
      }
    }
    ::v-deep {
      .el-dialog__body {
        padding: 5px 20px 20px;
      }
      .el-dialog__header {
        border-bottom: 0;
      }
      .pagination-line {
        margin-top: 20px;
        text-align: center;
      }
      .recommend{
        position: relative;
        overflow: hidden;
      }
      .recommend:before {
        content: "非app";
        position: absolute;
        top: -8px;
        right: -26px;
        z-index: 10;
        padding: 14px 22px 2px;
        background-color: #ff9900;
        transform: rotate(45deg);
        font-size: 10px;
        color: #ffffff;
      }
    }
  }
  </style>
  