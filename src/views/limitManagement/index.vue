<template>
  <div class="table-main-box">
    <el-card v-show="changePage('table')" class="table-main-content">
      <div class="table-main">
        <div class="show-table">
          <div class="handler-header-box">
            <div class="flex">
              <tb-search class="tb-search-style" ref="tbSearch" :conditions="conditions" :loading="loading"
                :selectOptionsProp="selectOptionsProp" :flatDistrictOptions="flatDistrictOptions"
                :districtFirstOptions="districtFirstOptions" @search="search">
                <el-button slot="customBtns" size="small" type="primary" :loading="loading"
                  @click="handlerChange({ sign: 'add' })">
                  新建
                </el-button>
              </tb-search>
            </div>
          </div>
          <div>
            <tb-table ref="tbTable" :loading="loading" :pager-config="pagerConfig" :handler-btns="handlerBtns"
              :table-title="tableTitle" :table-data="tableData" border handlerWith="320" @handlerChange="handlerChange"
              :selectOptionsProp="selectOptionsProp" @loadPage="loadPage">
              <!-- 机构列 -->
              <el-table-column align="center" slot="comCode" width="140" :show-overflow-tooltip="true"
                :label="data.label" slot-scope="{ data }">
                <template slot-scope="{ row }">
                  <span class="primary cursor" @click="handlerShowOrg(row.comCode)">
                    {{ getOrgLabel(row.comCode) }}
                  </span>
                </template>
              </el-table-column>

              <!-- 状态列 -->
              <el-table-column align="center" slot="status" width="90" :label="data.label" slot-scope="{ data }">
                <template slot-scope="{ row }">
                  <status-btn :title="getStatusTitle(row.configStatus)" :color="getStatusStyle(row.configStatus).color"
                    :bgColor="getStatusStyle(row.configStatus).bgColor">
                  </status-btn>
                </template>
              </el-table-column>

              <!-- 发布按钮 -->
              <template slot="handlerRelease" slot-scope="{ row }">
                <el-button type="text" size="small" :disabled="isDisabled(row, 'release')"
                  @click="handlerRelease({ row })">
                  发布
                </el-button>
              </template>

              <!-- 编辑按钮 -->
              <template slot="handlerChange" slot-scope="{ row }">
                <el-button type="text" size="small" :disabled="isDisabled(row, 'change')"
                  @click="handlerChange({ row, sign: 'change' })">
                  编辑
                </el-button>
              </template>

              <!-- 下架按钮插槽 -->
              <template slot="handlerDelist" slot-scope="{ row }">
                <el-button type="text" size="small" :disabled="isDisabled(row, 'delist')"
                  @click="handlerDelist({ row })">
                  下架
                </el-button>
              </template>

              <!-- 删除按钮 -->
              <template slot="del" slot-scope="{ row }">
                <el-button type="text" :disabled="isDisabled(row, 'delete')" size="small" @click="handlerDel({ row })">
                  删除
                </el-button>
              </template>
            </tb-table>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 新建/编辑组件 -->
    <AddCmp v-if="changePage('add')" ref="addCmpEl" :flatDistrictOptions="flatDistrictOptions"
      :districtFirstOptions="districtFirstOptions" :riskOptions="selectOptionsProp.riskOptions"
      :handlerPageSign.sync="handlerPageSign" :handlerSign="handlerSign" :handlerRow="handlerRow"
      :disabled="handlerSign === 'view'" :selectOptionsProp="selectOptionsProp" @getList="loadPage" />

    <!-- 机构展示弹窗 -->
    <component :is="'org'" :handler-row="handlerRow" ref="orgEl" :flatDistrictOptions="flatDistrictOptions"
      :districtFirstOptions="districtFirstOptions" :disabled="true" :footerSlot="true" :showSelectPerson="false"
      :isSelectCase="true" v-model="handlerControlVisible" v-if="handlerControlVisible">
    </component>
  </div>
</template>

<script>
import { setChilrenToNull, flatTree } from "@/utils/tree";
import conditions from "./searchbar";
import tableTitle, { handlerBtns } from "./table";
import AddCmp from "./addCmp.vue";
import ShowOrg from "@/packages/SearchOrg/src/org";
import { getCurrentPage, deepClone, dataToJson, getObjLabel } from "@/utils/tools";

export default {
  components: {
    AddCmp,
    org: ShowOrg
  },
  data() {
    return {
      handlerControlVisible: false,
      selectOptionsProp: {
        org: [],
        riskOptions: [],
      },
      flatDistrictOptions: [], //机构
      districtFirstOptions: [], //扁平机构
      handlerPageSign: "table",
      loading: false,
      conditions: deepClone(conditions),
      tableTitle,
      handlerBtns,
      handlerSign: "add",
      handlerRow: {},
      tableData: [],
      map: {},
      pagerConfig: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      }
    };
  },
  created() {
    this.queryDistrict();
    this.getRiskOptions();
  },
  mounted() {
    this.loadPage();
  },
  methods: {
    // 获取机构
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
    // 获取险种
    getRiskOptions() {
      this.$api("base/selectAllRisk").then((res) => {
        let list = res.data || [];
        list.forEach((it) => {
          it.label = `${it.riskName}`;
        });
        this.selectOptionsProp.riskOptions = list;
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
    handlerShowOrg(comCode = []) {
      this.handlerControlVisible = true;
      // 解析JSON字符串为数组
      const orgCodes = typeof comCode === 'string' ? JSON.parse(comCode) : comCode;

      let data = {
        salesOrganization: orgCodes, // 使用解析后的数组
        personnelScope: [],
      };
      this.$nextTick(() => {
        this.$refs.orgEl.init(data);
      });
    },
    isDisabled(row, type) {
      const status = row.configStatus; // 获取状态

      const permissionMap = {
        // 待发布状态
        'N': {
          view: false,    // 查看允许
          release: false, // 发布允许
          change: false,  // 编辑允许
          delist: true,   // 下架禁用
          delete: false   // 删除允许
        },
        // 运行中状态
        'R': {
          view: false,    // 查看允许
          release: true,  // 发布禁用
          change: true,   // 编辑禁用
          delist: false,  // 下架允许
          delete: true    // 删除禁用
        },
        // 已下架状态
        'D': {
          view: false,    // 查看允许
          release: false, // 发布允许
          change: true,  // 编辑禁用
          delist: true,   // 下架禁用
          delete: true   // 删除禁用
        }
      };

      // 如果状态不存在或按钮类型不存在，默认禁用
      if (!status || !permissionMap[status]) {
        return true;
      }

      return permissionMap[status][type] || false;
    },
    changePage(type = "table") {
      return this.handlerPageSign === type;
    },

    loadPage() {
      this.loading = true;
      const params = {
        currentPage: this.pagerConfig.currentPage,
        pageSize: this.pagerConfig.pageSize,
        ...this.formatRequestParams(this.map)
      };

      this.$api("limits/queryListByPage", params)
        .then((res) => {
          if (res.code === 200) {
            let list = res.data.list || [];
            const promises = list.map(item => {
              return this.$api("limits/selectCommonConfigComcode", item.configId)
                .then(res => {
                  if (res.code === 200) {
                    item.comCode = res.data;
                  }
                  return item;
                })
                .catch(() => item);
            });

            Promise.all(promises)
              .then(updatedList => {
                this.tableData = dataToJson(updatedList);
                this.pagerConfig.total = res.data.total || 0;
              });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 获取状态文案
    getStatusTitle(status) {
      const statusMap = {
        'N': '暂存',
        'R': '运行中',
        'D': '已下架'
      };
      return statusMap[status] || status;
    },

    // 获取状态样式
    getStatusStyle(status) {
      const styleMap = {
        'N': {
          color: '#888D95',
          bgColor: '#DEE0E3'
        },
        'R': {
          color: '#70B603',
          bgColor: '#F5FEE6'
        },
        'D': {
          color: '#F46565',
          bgColor: '#F5CACA'
        }
      };
      return styleMap[status] || {};
    },
    // 格式化请求参数方法
    formatRequestParams(map) {
      return {
        deptCodes: map.comCodeList || [],        // 机构代码数组
        natureCode: map.insuranceNature || '', // 保险性质
        riskCode: map.riskCode || '',        // 险种代码
        configStatus: map.configStatus || '', // 添加状态参数
      };
    },
    search(map) {
      this.map = map;
      this.pagerConfig.currentPage = 1;
      this.loadPage();
    },
    // 处理新建/编辑/查看
    handlerChange({ row, sign }) {
      this.handlerPageSign = "add";
      this.handlerSign = sign || "add";
      if (row) {
        this.loading = true;
        this.$api("limits/queryById", row.configId)
          .then((res) => {
            if (res.code === 200 && res.data) {
              // 直接使用接口返回的数据结构
              this.handlerRow = res.data;
            } else {
              this.$message.error("获取详情失败");
            }
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        // 新建时清空数据
        this.handlerRow = {};
      }
    },
    // 下架方法
    handlerDelist({ row }) {
      this.$confirm(`确认下架该规则?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.loading = true;
        this.$api("limits/offLineLimitConfig", row.configId)
          .then(() => {
            this.$message.success("下架成功");
            this.loadPage();
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    // 发布方法
    handlerRelease({ row }) {
      this.$confirm(`确认发布该规则?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.loading = true;
        this.$api("limits/publishLimitConfig", row.configId)
          .then(() => {
            this.$message.success("发布成功");
            this.loadPage();
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    handlerDel({ row }) {
      this.$confirm(`确认删除该项?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.loading = true;
        this.$api("limits/deleteLimitConfig", row.configId)
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
    }
  }
};
</script>

<style scoped lang="scss">
.table-main-box {
  .table-main-content {
    ::v-deep {
      &>.el-card__body {
        padding: 0;
      }

      .el-table__fixed,
      .el-table__fixed-right {
        height: 100% !important;
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
      }
    }
  }
}
</style>