<template>
    <div class="table-main-box">
        <el-card v-show="changePage('table')" class="table-main-content">
            <div class="table-main">
                <div class="show-table">
                    <div class="handler-header-box">
                        <div class="flex">
                            <tb-search class="tb-search-style" ref="tbSearch" :conditions="conditions"
                                :loading="loading" :selectOptionsProp="selectOptionsProp"
                                :flatDistrictOptions="flatDistrictOptions" :districtFirstOptions="districtFirstOptions"
                                @search="search" @changeSelect="handleConditionChange">
                                <el-button slot="customBtns" size="small" type="primary" :loading="loading"
                                    @click="exportData({ sign: 'add' })">
                                    下载
                                </el-button>
                            </tb-search>
                        </div>
                    </div>
                    <div class="statistics-container" v-loading="statisticsLoading">
                        <div class="statistics-item">
                            <span class="statistics-label">核保数：</span>
                            <span class="statistics-value">{{ statistics.plyCount || 0 }}</span>
                        </div>
                        <div class="statistics-item">
                            <span class="statistics-label">自核通过数：</span>
                            <span class="statistics-value">{{ statistics.auditSuccCount || 0 }}</span>
                        </div>
                        <div class="statistics-item">
                            <span class="statistics-label">自核通过率：</span>
                            <span class="statistics-value">{{ statistics.auditSuccRate ? statistics.auditSuccRate + '%'
                                : '0%' }}</span>
                        </div>
                    </div>
                    <div>
                        <tb-table ref="tbTable" :loading="loading" :pager-config="pagerConfig"
                            :handler-btns="handlerBtns" :table-title="tableTitle" :table-data="tableData" border
                            handlerWith="150" :selectOptionsProp="selectOptionsProp" @loadPage="loadPage">
                            <!-- 投保单号 -->
                            <el-table-column slot="policyNo" :label="data.label" slot-scope="{ data }" align="center"
                                min-width="180">
                                <template slot-scope="{ row }">
                                    <span class="link-text" @click="handleRuleDetails(row)">
                                        {{ row.policyNo }}
                                    </span>
                                </template>
                            </el-table-column>

                            <!-- 机构列 -->
                            <el-table-column align="center" slot="comCode" :label="data.label" slot-scope="{ data }"
                                min-width="150">
                                <template slot-scope="{ row }">
                                    <span class="primary cursor" @click="handlerShowOrg(row.comCode)">
                                        {{ getOrgLabel(row.comCode) }}
                                    </span>
                                </template>
                            </el-table-column>

                            <!-- 核保结果列 -->
                            <el-table-column align="center" slot="executeResult" width="100" :label="data.label"
                                slot-scope="{ data }">
                                <template slot-scope="{ row }">
                                    <status-btn :title="getExecuteResultLabel(row.ruleExecStatus)"
                                        v-bind="getExecuteResultStyle(row.ruleExecStatus)" />
                                </template>
                            </el-table-column>

                            <!-- 操作列 -->
                            <template slot="handlerDetails" slot-scope="{ row }">
                                <el-button type="text" size="small" @click="handleRuleDetails(row)">
                                    查看核保详情
                                </el-button>
                            </template>
                        </tb-table>
                    </div>
                </div>
            </div>
        </el-card>

        <!-- 机构展示弹窗 -->
        <component :is="'org'" :handler-row="handlerRow" ref="orgEl" :flatDistrictOptions="flatDistrictOptions"
            :districtFirstOptions="districtFirstOptions" :disabled="true" :footerSlot="true"
            v-model="handlerControlVisible" v-if="handlerControlVisible" />
    </div>
</template>

<script>
import { setChilrenToNull, flatTree } from "@/utils/tree"
import conditions from './searchbar'
import tableTitle, { handlerBtns } from './table'
import ShowOrg from "@/packages/SearchOrg/src/org"
import { getCurrentPage, deepClone, dataToJson, getObjLabel } from "@/utils/tools"

export default {
    name: 'RuleLogManagement',
    components: {
        org: ShowOrg
    },
    data() {
        return {
            handlerControlVisible: false,
            selectOptionsProp: {
                org: [],
                riskClassOptions: [],
                riskOptions: []
            },
            flatDistrictOptions: [], // 机构
            districtFirstOptions: [], // 扁平机构
            handlerPageSign: "table",
            loading: false,
            statisticsLoading: false, // 新增统计加载状态
            statistics: {
                plyCount: 0,        // 核保数
                auditSuccCount: 0,   // 自核通过数
                auditSuccRate: 0     // 自核通过率
            },
            conditions: deepClone(conditions),
            tableTitle,
            handlerBtns,
            handlerRow: {},
            tableData: [],
            exportLoading: false,
            map: {},
            pagerConfig: {
                currentPage: 1,
                total: 0,
                pageSize: 10
            }
        }
    },
    created() {
        this.queryDistrict()
        this.getRiskClass()
    },
    mounted() {
        this.loadPage()
    },
    methods: {
        fetchStatistics() {
            this.statisticsLoading = true;

            this.$api('ruleLog/selectAgriRuleExecStaticis', {
                ...this.map
            }).then(res => {
                if (res.code === 200 && res.data) {
                    this.statistics = res.data;
                    // 在这里我们先假设返回的数据格式是合适的
                    // 等你告诉我实际返回格式后再调整
                }
            }).catch(error => {
                console.error('获取统计数据失败:', error);
                this.$message.error('获取统计数据失败');
            }).finally(() => {
                this.statisticsLoading = false;
            });
        },
        // 获取机构
        queryDistrict() {
            this.$api("common/queryDistrict").then((res) => {
                let data = res.data || {}
                let list = setChilrenToNull([data])
                let flatTreeData = flatTree(list)
                this.flatDistrictOptions = flatTreeData
                this.districtFirstOptions = list
                this.selectOptionsProp.org = flatTreeData
            })
        },

        // 获取险类数据
        getRiskClass() {
            this.loading = true;
            this.$api("plot/selectWholeClasses")
                .then(res => {
                    if (res.code === 200) {
                        const list = res.data || [];
                        this.selectOptionsProp.riskClassOptions = list.map(item => ({
                            label: item.classesName,
                            value: item.classesCode
                        }));
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 根据险类获取险种列表
        getRiskListByClass(classesCode) {
            if (!classesCode) {
                this.selectOptionsProp.riskOptions = [];
                return;
            }

            this.loading = true;
            this.$api(`plot/selectClassesRisks`, classesCode)
                .then(res => {
                    if (res.code === 200) {
                        const list = res.data || [];
                        this.selectOptionsProp.riskOptions = list.map(item => ({
                            label: `${item.riskName}`,
                            value: item.riskCode,
                            riskName: item.riskName
                        }));
                    }
                })
                .catch(err => {
                    console.error('获取险种数据失败:', err);
                    this.$message.error('获取险种数据失败');
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 处理险类变化事件
        handleConditionChange({ value, item, map }) {
            if (item.prop === 'riskClass') {
                // 清空险种选择
                this.$refs.tbSearch.setConditionVal([{
                    prop: "riskCode",
                    val: "",
                    key: "value"
                }]);
                this.selectOptionsProp.riskOptions = [];

                // 有选择险类时才去查询险种
                if (value) {
                    this.getRiskListByClass(value);
                }
            }
        },

        // 获取机构名称
        getOrgLabel(comCode = []) {
            if (comCode?.length) {
                let val = comCode[0]
                return getObjLabel({
                    val,
                    arr: this.flatDistrictOptions,
                    value: "comCode",
                    label: "comName"
                })
            }
            return ''
        },

        // 查看机构
        handlerShowOrg(comCode = []) {
            this.handlerControlVisible = true
            let data = {
                salesOrganization: comCode,
                personnelScope: []
            }
            this.$nextTick(() => {
                this.$refs.orgEl.init(data)
            })
        },

        // 获取核保结果标签
        getExecuteResultLabel(ruleExecStatus) {
            const map = {
                'true': '成功',
                'false': '失败',
                'running': '执行中'
            }
            return map[ruleExecStatus] || ruleExecStatus
        },

        // 获取核保结果样式
        getExecuteResultStyle(ruleExecStatus) {
            const map = {
                'true': {
                    color: "#70B603",
                    bgColor: "#F5FEE6"
                },
                'false': {
                    color: "#F46565",
                    bgColor: "#F5CACA"
                }
            }
            return map[ruleExecStatus] || {}
        },

        // 切换页面
        changePage(type = "table") {
            return this.handlerPageSign === type
        },

        // 加载列表数据
        loadPage() {
            this.loading = true
            // 调用实际的API接口
            this.$api('ruleLog/queryRuleExecPage', {
                ...this.map,
                currentPage: this.pagerConfig.currentPage,
                pageSize: this.pagerConfig.pageSize
            }).then(res => {
                this.tableData = res.data.list || []
                this.pagerConfig.total = res.data.total || 0
            }).finally(() => {
                this.loading = false
            })

            this.fetchStatistics();
        },

        // 添加格式化查询参数的方法
        formatRequestParams(map) {
            // 创建一个新的参数对象
            const params = {};

            // 投保单号
            if (map.busiNo) {
                params.busiNo = map.busiNo;
            }

            // 机构代码
            if (map.comCode) {
                params.comCode = map.comCode;
            }

            // 险类代码 - 单独处理险类查询
            if (map.riskClass) {
                params.classesCode = map.riskClass;
            }

            // 险种代码
            if (map.riskCode) {
                params.riskCode = map.riskCode;
            }

            return params;
        },

        // search 方法
        search(map) {
            // 使用格式化后的参数
            this.map = this.formatRequestParams(map);
            this.pagerConfig.currentPage = 1;
            this.loadPage();
        },

        // 查看核保详情
        handleRuleDetails(row) {
            const newPage = this.$router.resolve({
                path: '/ruleLogManagement/logDetails',
                query: {
                    ruleExecId: row.ruleExecId,
                    // ruleExecId: '1917868867262300', //////////////////////////////////////////////
                }
            })
            window.open(newPage.href, "_blank")
        },
        // 处理导出
        exportData() {
            if (this.exportLoading) return;
            this.exportLoading = true;

            // 直接从搜索组件实例中获取当前的查询条件
            const currentSearchParams = {};
            this.$refs.tbSearch.conditions.forEach(condition => {
                if (condition.value !== undefined && condition.value !== '') {
                    currentSearchParams[condition.prop] = condition.value;
                }
            });

            // 格式化查询参数
            const requestParams = this.formatRequestParams(currentSearchParams);

            // 添加分页参数
            const params = {
                ...requestParams,
                currentPage: this.pagerConfig.currentPage,
                pageSize: this.pagerConfig.pageSize
            };

            this.$api('ruleLog/downExport', params)
                .then(response => {
                    const blob = new Blob([response], {
                        type: 'application/vnd.ms-excel'
                    });

                    const link = document.createElement('a');
                    const filename = `规则执行日志_${new Date().getTime()}.xlsx`;

                    link.href = window.URL.createObjectURL(blob);
                    link.download = filename;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                    this.$message.success('导出成功');
                })
                .catch(error => {
                    console.error('导出失败:', error);
                    this.$message.error('导出失败');
                })
                .finally(() => {
                    this.exportLoading = false;
                });
        }
    }
}
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

    .statistics-container {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 20px;
        background-color: #f5f7fa;
        padding: 15px;
        border-radius: 4px;

        .statistics-item {
            margin-right: 40px;

            .statistics-label {
                font-weight: bold;
                color: #606266;
            }

            .statistics-value {
                color: #409EFF;
                font-size: 16px;
                margin-left: 8px;
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

    .link-text {
        color: #409EFF;
        cursor: pointer;

        &:hover {
            color: #66b1ff;
        }
    }

    .primary {
        color: #409EFF;
        cursor: pointer;
    }
}
</style>