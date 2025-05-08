<template>
  <div class="table-main-box">
    <el-card
      v-show="changePage('table')"
      class="table-main-content"
    >
      <div class="table-main">
        <div class="show-table">
          <div class="handler-header-box">
            <div class="flex">
              <tb-search
                class="tb-search-style"
                ref="tbSearch"
                :conditions="conditions"
                :loading="loading"
                :selectOptionsProp="selectOptionsProp"
                :flatDistrictOptions="flatDistrictOptions"
                :districtFirstOptions="districtFirstOptions"
                @search="search"
              >
                <el-button
                  slot="customBtns"
                  size="small"
                  type="primary"
                  :loading="loading"
                  @click="handlerChange({ sign: 'add' })"
                >
                  新建
                </el-button>
              </tb-search>
            </div>
          </div>
          <div>
            <tb-table
              ref="tbTable"
              :loading="loading"
              :pager-config="pagerConfig"
              :handler-btns="handlerBtns"
              :table-title="tableTitle"
              :table-data="tableData"
              border
              handlerWith="320"
              @handlerChange="handlerChange"
              :selectOptionsProp="selectOptionsProp"
              @handlerCopy="handlerCopy"
              @loadPage="loadPage"
            >
              <el-table-column
                align="center"
                slot="ruleVersion"
                width="90"
                :label="data.label"
                slot-scope="{ data }"
              >
                <!-- 版本号 -->
                <template slot-scope="{ row }">
                  {{ row.ruleVersion ? 'V' + row.ruleVersion : '' }}
                </template>
              </el-table-column>
              <!-- 机构 -->
              <el-table-column
                align="center"
                slot="comCode"
                width="140"
                :show-overflow-tooltip="true"
                :label="data.label"
                slot-scope="{ data }"
              >
                <template slot-scope="{ row }">
                  <span
                    class="primary cursor"
                    @click="handlerShowOrg(row.comCode)"
                  >
                    {{ getOrgLabel(row.comCode) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                slot="status"
                width="90"
                :label="data.label"
                slot-scope="{ data }"
              >
                <!-- 状态 -->
                <template slot-scope="{ row }">
                  <status-btn
                    :title="row.statusConfig.label"
                    :color="row.statusConfig.color"
                    :bgColor="row.statusConfig.bgColor"
                  ></status-btn>
                </template>
              </el-table-column>
              <template
                slot="handlerRelease"
                slot-scope="{ row }"
              >
                <el-button
                  type="text"
                  size="small"
                  :disabled="isDisabled(row, 'release')"
                  @click="handlerRelease({ row })"
                >
                  发布
                </el-button>
              </template>
              <template
                slot="handlerChange"
                slot-scope="{ row }"
              >
                <el-button
                  type="text"
                  size="small"
                  :disabled="isDisabled(row, 'change')"
                  @click="handlerChange({ row, sign: 'change' })"
                >
                  编辑
                </el-button>
              </template>
              <template
                slot="version"
                slot-scope="{ row }"
              >
                <el-button
                  type="text"
                  size="small"
                  :disabled="!row.groupCode"
                  @click="handlerControl({ row, sign: 'historyVersion' })"
                >
                  历史版本
                </el-button>
              </template>
              
              <template
                slot="del"
                slot-scope="{ row }"
              >
                <!-- -->
                <el-button
                  type="text"
                  :disabled="isDisabled(row, 'delete')"
                  size="small"
                  @click="handlerDel({ row })"
                >
                  删除
                </el-button>
              </template>
            </tb-table>
          </div>
        </div>
      </div>
    </el-card>
    <AddCmp
      :flatDistrictOptions="flatDistrictOptions"
      :districtFirstOptions="districtFirstOptions"
      v-if="changePage('add')"
      ref="addCmpEl"
      @openChild="openChild"
      :factorOptions="cmpOptions.factorOptions"
      :functionOptions="cmpOptions.functionOptions"
      :constantOptions="cmpOptions.constantOptions"
      :riskOptions="cmpOptions.riskOptions"
      :handlerPageSign.sync="handlerPageSign"
      :handlerSign="handlerSign"
      :handlerRow="handlerRow"
      :handlerType="handlerType"
      @getList="loadPage"
    />
    <component
      :is="handlerControlSign"
      :handler-row="handlerRow"
      ref="cmpEl"
      :flatDistrictOptions="flatDistrictOptions"
      :districtFirstOptions="districtFirstOptions"
      :handlerControlSign="handlerControlSign"
      @handlerHistoryChange="handlerChange"
      @getList="loadPage"
      @handlerPublish="handlerPublish"
      :handlerCurrentPage="handlerCurrentPage"
      :cmpOptions="cmpOptions"
      :isFilterTree="true"
      :isSelectCase="true"
      :showSelectPerson="false"
      :loading="loading"
      :useVCode="useVCode"
      :disabled="handlerControlSign == 'org'"
      :footerSlot="handlerControlSign == 'org'"
      v-model="handlerControlVisible"
      v-if="handlerControlVisible"
    ></component>
  </div>
</template>
<script>
import { setChilrenToNull, flatTree } from "@/utils/tree";
import conditions from "./searchbar";
import tableTitle, { handlerBtns } from "./table";
import AddCmp from "./addCmp.vue";
import SelectOrg from "./components/selectOrg";
import { ruleStatusOptions } from "@/config/options";
import {
  getCurrentPage,
  deepClone,
  dataToJson,
  getObjLabel,
} from "@/utils/tools";
import HistoryVersion from "./components/historyVersion";
import ShowOrg from "@/packages/SearchOrg/src/org";
export default {
  components: {
    AddCmp,
    SelectOrg,
    historyVersion: HistoryVersion,
    org: ShowOrg,
    publish: () => import("@/components/PublishCmp/publishCmp.vue"),
  },
  data() {
    return {
      handlerCurrentPage: 1,
      useVCode: false, //发布是否需要验证码
      handlerFatherRow: {},
      handlerType: "father",
      ruleStatusOptions,
      isOpend: true,
      selectOptionsProp: {
        org: [],
        riskOptions: [],
      },
      flatDistrictOptions: [], //机构
      districtFirstOptions: [], //扁平机构
      cmpOptions: {
        factorOptions: [], //因子
        functionOptions: [], //函数
        constantOptions: [], //常量
        riskOptions: [], //险种
      },
      handlerPageSign: "table",
      loadingSubmit: false,
      treeData: [], // 权限
      loading: false,
      conditions: deepClone(conditions),
      tableTitle,
      handlerBtns,
      visible: false,
      handlerSign: "add",
      handlerRow: {},
      tableData: [],
      map: {},
      pagerConfig: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      handlerControlSign: "execSta",
      handlerControlVisible: false,
    };
  },
  computed: {
    handlerTitle({ handlerSign }) {
      return handlerSign === "add" ? "新增角色" : "修改角色";
    },
  },
  created() {
    //获取机构
    this.queryDistrict();
    //获取函数
    this.getOptions();
  },
  mounted() {
    this.loadPage();
  },
  methods: {
    handlerShowOrg(comCode = []) {
      this.handlerControlSign = "org";
      let data = {
        salesOrganization: comCode,
        personnelScope: [],
      };
      this.handlerControlVisible = true;
      this.$nextTick(() => {
        this.$refs.cmpEl.init(data);
      });
    },
    getOrgLabel(comCode = []) {
      if (comCode?.length) {
        let val = comCode[0];
        return getObjLabel({
          val,
          arr: this.flatDistrictOptions,
          value: "comCode",
          label: "comName",
        });
      }
    },
    isDisabled(row, sign) {
      const obj = {
        release: ["notPublish"],
        delete: ["temporary", "notPublish"],
        change: ["temporary", "notPublish"],
      };
      let data = obj[sign] || [];
      return !data.includes(row.ruleState);
    },
    handlerOpen() {
      this.isOpend = !this.isOpend;
    },
    //获取下拉接口
    getOptions() {
      this.getFactor();

      let arr = [
        {
          url: "base/queryAllTarget",
          key: "functionOptions",
        },
        {
          url: "base/selectAllRisk",
          key: "riskOptions",
        },
        {
          url: "base/pageAllConstant",
          key: "constantOptions",
        },
      ];
      arr.forEach((v) => {
        this.$api(v.url).then((res) => {
          this.cmpOptions[v.key] = res.data || [];
          if (this.selectOptionsProp[v.key]) {
            let list = res.data || [];

            if (v.key === "riskOptions") {
              list.forEach((it) => {
                it.label = `${it.riskCode}_${it.riskName}`;
              });
            }
            this.selectOptionsProp[v.key] = list;
          }
        });
      });
    },
    getFactor() {
      this.$api("rules/queryAgriDivisorAll").then((res) => {
        this.cmpOptions.factorOptions = res.data || [];
      });
    },
    openChild() {
      this.handlerControlSign = "historyVersion";
      let { currentPage } = this.handlerRow;
      this.handlerCurrentPage = currentPage;
      this.handlerRow = deepClone(this.handlerFatherRow);
      this.handlerControlVisible = true;
    },
    handlerControl({ sign, row }) {
      this.handlerControlSign = sign;
      this.handlerCurrentPage = 1;
      if (row) {
        this.handlerRow = deepClone(row);
      }
      this.handlerControlVisible = true;
    },
    //获取机构
    queryDistrict() {
      this.$api("common/queryDistrict").then((res) => {
        let data = res.data || {};
        let list = setChilrenToNull([data]);
        let flatTreeData = flatTree(list);
        this.flatDistrictOptions = flatTreeData;
        this.districtFirstOptions = list;
        this.selectOptionsProp.org = flatTreeData;
      });
    },

    //修改页面
    changePage(type = "table") {
      return this.handlerPageSign === type;
    },
    // 请求列表
    loadPage() {
      this.loading = true;
      let { comCodeList } = this.map;
      let comCodeListStr = comCodeList ? JSON.stringify(comCodeList) : null;
      this.$api("rules/queryAgriRuleList", {
        ...this.map,
        // comCodeList:comCodeListStr,
        currentPage: this.pagerConfig.currentPage,
        pageSize: this.pagerConfig.pageSize,
      })
        .then((res) => {
          let list = res.data.list || [];
          list.forEach((it) => {
            let statusConfig = getObjLabel(
              {
                val: it.ruleState,
                arr: ruleStatusOptions,
              },
              true
            );
            it.statusConfig = statusConfig;
          });
          this.tableData = dataToJson(list);
          this.pagerConfig.total = res.data.total || 0;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    search(map) {
      this.map = map;
      this.pagerConfig.currentPage = 1;
      this.loadPage();
    },
    // 新增、更改用户
    handlerChange({ row, sign, handlerType, handlerFatherRow, currentPage }) {
      this.visible = true;
      this.handlerPageSign = "add";
      this.handlerSign = sign;
      this.getFactor();
      this.handlerType = handlerType || "father";
      if (handlerType == "son") {
        row.currentPage = currentPage;
      }
      if (row) {
        this.handlerRow = deepClone(row);
        this.handlerFatherRow = deepClone(handlerFatherRow);
      }
    },
    handlerPublish(verifyCode) {
      this.loading = true;
      this.$api("rules/publishAgriRule", { id: this.handlerRow.id, verifyCode })
        .then(() => {
          this.$message.success("发布成功");
          this.handlerControlVisible = false;
          this.loadPage();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //发布
    handlerRelease({ row }) {
      this.handlerRow = deepClone(row);
      if (!this.useVCode) {
        this.handlerReleaseFn();
      } else {
        this.handlerControlSign = "publish";
        this.handlerControlVisible = true;
      }
    },
    handlerReleaseFn() {
      this.$confirm(`确认发布该规则?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.handlerPublish();
      });
    },
    //复制
    handlerCopy({ row }) {
      let {
        ruleName,
        ruleConditionData,
        clauseCode,
        comCode,
        ruleNode,
        riskCode,
        growingNum,
        growingSum,
        recognizeeLossRation,
      } = row;

      this.$prompt("请输入规则名称", "确认复制规则", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: ruleName + "-复制",
        inputValidator(val) {
          return !val ? "请输入规则名称" : true;
        },
      }).then(({ value }) => {
        let config = {
          comCode: "[]",
          clauseCode: "[]",
          ruleName: value,
          operationType: "temporary",
          growingNum,
          growingSum,
          recognizeeLossRation,
          ruleConditionData: JSON.stringify(ruleConditionData),
        };
        const isNeedCopyOrg=true
        // 测试++++++++++++++++
        if (isNeedCopyOrg) {
          // config.ruleNode = ruleNode
          config.riskCode = riskCode;
          config.clauseCode = JSON.stringify(clauseCode);
          config.comCode = JSON.stringify(comCode);
        }
        this.loading = true;
        this.$api("rules/saveBAgriRule", config)
          .then((res) => {
            this.$message.success("复制成功");
            this.loadPage();
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    // 删除
    handlerDel({ row }) {
      this.$confirm(`确认删除该项?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.loading = true;
        this.$api("rules/deleteAgriRule", { id: row.id })
          .then(() => {
            this.$message.success("删除成功");
            const { currentPage, total, pageSize } = this.pagerConfig;
            this.pagerConfig.currentPage = getCurrentPage({
              total,
              size: pageSize,
              current: currentPage,
            });
            this.loadPage();
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
  },
};
</script>
<style scoped lang="scss">
.table-main-box {
  .table-main-content {
    ::v-deep {
      & > .el-card__body {
        padding: 0;
      }

      .el-table__fixed,
      .el-table__fixed-right {
        height: 100% !important; //设置高优先，以覆盖内联样式
      }
    }
  }
  .table-main {
    .show-table {
      padding: 0 20px;
      overflow: hidden;
    }
    .tb-table-main {
      overflow: hidden;
    }

    .handler-header-box {
      margin-bottom: 20px;
      ::v-deep {
        .tb-search-style {
          flex: 1;
        }
        .arrow-control-icon {
          display: flex;
          align-items: center;
          font-size: 24px;
          cursor: pointer;
          margin: 4px 15px 0 0;
        }
        .el-card__body {
          padding: 0;
        }
        .s-flex-query__body {
          padding-bottom: 0;
        }
        .s-flex-query {
          margin-bottom: 0;
          padding-left: 0;
        }
        .handler-btn-list {
          display: flex;
          justify-content: space-between;
          background: #fff;
        }
      }
    }
  }
}
</style>
