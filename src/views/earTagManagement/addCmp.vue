<template>
    <div class="add-cmp-ear-tag">
        <el-card class="mb20">
            <div class="btn-list">
                <div>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>审核权限规则配置</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div>
                    <el-button v-if="!isDetailDisabled" type="primary" :loading="loading" size="mini"
                        @click="handlerSave">
                        确定
                    </el-button>
                    <el-button type="info" @click="returnTable" size="mini">
                        {{ isDetailDisabled ? '返回' : '取消' }}
                    </el-button>
                </div>
            </div>
        </el-card>
        <el-card>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="common-form-main"
                :disabled="disabled || handlerSign === 'view'" label-position="left">
                <!-- 机构 -->
                <el-form-item label="机构：" prop="comCode" required>
                    <search-org :data.sync="form.comCode" :disabled="disabled" v-bind="$attrs" :hasView="false"
                        :hasDel="!disabled" class="org-line" @clearValidate="clearValidate" placeholder="点击选择机构" />
                </el-form-item>

                <!-- 险种 -->
                <el-form-item label="险种：" prop="riskCode" required>
                    <el-select v-model="form.riskCode" placeholder="请选择险种" clearable filterable style="width: 100%"
                        @change="handlerChangeRisk">
                        <el-option v-for="item in riskOptions" :key="item.riskCode"
                            :label="`${item.riskName}`" :value="item.riskCode" />
                    </el-select>
                </el-form-item>

                <!-- 险类 -->
                <el-form-item label="险类：" prop="riskClass">
                    <el-input v-model="form.riskClass" placeholder="根据险种自动带出" :disabled="true" style="width: 100%" />
                </el-form-item>

                <!-- 标的唯一标识 -->
                <el-form-item label="标的唯一标识：" prop="identifyType" required>
                    <el-select v-model="form.identifyType" placeholder="标的唯一标识" clearable style="width: 100%">
                        <el-option label="耳标照" value="earTag" />
                        <el-option label="大棚钥匙锁码" value="DPYSSM" />
                    </el-select>
                </el-form-item>

                <!-- 备注 -->
                <el-form-item label="备注：" prop="remark">
                    <el-input v-model="form.remark" type="textarea" :rows="2" maxlength="200" show-word-limit
                        placeholder="请输入备注" />
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { deepClone } from "@/utils"

export default {
    name: 'AddEarTag',
    props: {
        handlerPageSign: {},
        handlerSign: {
            default: "add"
        },
        handlerRow: {},
        riskOptions: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            loading: false,
            form: {
                comCode: [], // 机构
                riskCode: '', // 险种
                riskClass: '', // 险类
                identifyType: '', // 标的唯一标识
                remark: '' // 备注
            },
            rules: {
                comCode: [{ required: true, message: '请选择机构', trigger: 'change' }],
                riskCode: [{ required: true, message: '请选择险种', trigger: 'change' }],
                identifyType: [{ required: true, message: '请选择标的唯一标识', trigger: 'change' }]
            }
        }
    },
    computed: {
        isDetailDisabled({ handlerSign }) {
            return handlerSign === "view";
        }
    },
    watch: {
        handlerRow: {
            handler(val) {
                if (val?.configId && this.handlerSign != "add") {
                    this.init(val);
                }
            },
            immediate: true,
            deep: true,
        }
    },
    methods: {
        // 险种变更处理
        handlerChangeRisk(val, isInit = false) {
            // 非初始化场景时清空险类
            if (!isInit) {
                this.form.riskClass = '';
            }
            if (val) {
                // 调用条款查询接口获取险类信息
                this.$api("earTag/selectClause", {
                    riskCodeList: [val]
                }).then(res => {
                    if (res.code === 200 && res.data && res.data.length > 0) {
                        // 取第一条数据的险类名称
                        this.form.riskClass = res.data[0].classesName || '';

                        // 将所有条款名称用分号拼接
                        this.form.clauseName = res.data
                            .map(item => item.clauseName)
                            .filter(Boolean)  // 过滤掉空值
                            .join(';\n');  // 使用分号+换行符拼接多个条款名称
                    }
                }).catch(err => {
                    console.error("获取险类信息失败:", err);
                    this.$message.error("获取险类信息失败");
                });
            }
        },
        init(val) {
            this.setValue(val);
        },

        setValue(detail) {
            const data = deepClone(detail);

            this.form = {
                // 处理机构数据 - 从 deptList 中提取 comcode 数组
                comCode: data.deptList ? data.deptList.map(item => item.comcode) : [],

                // 处理险种数据 - 从 riskConfig 中提取
                riskCode: data.riskConfig?.riskCode || '',

                // 险类名称 - 从 riskConfig 中提取
                riskClass: data.riskConfig?.classesName || '',

                // 标的唯一标识
                identifyType: data.targetClassify || '',

                // 备注
                remark: data.remark || ''
            };

            // 如果有险种信息，需要获取对应的险类
            if (this.form.riskCode) {
                // 编辑/查看场景下，传入 true 表示是初始化数据，避免清空险类
                this.handlerChangeRisk(this.form.riskCode, true);
            }
        },
        // 险种变更时自动带出险类
        handleRiskChange(riskCode) {
            if (riskCode) {
                const riskItem = this.riskOptions.find(item => item.riskCode === riskCode);
                this.form.riskClass = riskItem ? riskItem.riskClass || '根据险种带出' : '';
            } else {
                this.form.riskClass = '';
            }
        },
        clearValidate() {
            this.$refs.form.clearValidate();
        },
        returnTable() {
            this.$emit("update:handlerPageSign", "table");
        },

        handlerSave() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const params = this.formatSaveParams();

                    // 如果是编辑，需要额外带上configId
                    if (this.handlerSign === 'change') {
                        params.configId = this.handlerRow.configId;  // 编辑时需要带上configId
                    }

                    this.loading = true;

                    // 根据操作类型选择不同的API
                    const apiUrl = this.handlerSign === 'add'
                        ? 'earTag/saveTTarge'    // 新增接口
                        : 'earTag/updateTTarge'; // 编辑接口

                    this.$api(apiUrl, params)
                        .then(() => {
                            this.$message.success(`${this.handlerSign === 'add' ? '新增' : '编辑'}成功`);
                            this.$emit("getList");
                            this.returnTable();
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                }
            });
        },

        // 格式化保存参数
        formatSaveParams() {
            const { comCode, riskCode, riskClass, identifyType, remark } = this.form;

            const baseParams = {
                deptList: comCode.map(code => ({
                    comcode: code
                })),
                remark: remark || '',
                riskConfig: {
                    riskCode: riskCode || '',
                    //classesCode: riskClass || '',  // 如果后端需要这个字段
                },
                targetClassify: identifyType || ''
            };

            return baseParams;
        }

    }
}
</script>

<style scoped lang="scss">
.add-cmp-ear-tag {
    .mb20 {
        margin-bottom: 15px;
    }

    .btn-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    ::v-deep {
        .el-card__body {
            padding: 20px;
        }

        .common-form-main {
            width: 600px;
        }

        .org-line {
            width: 100%;
        }
    }
}
</style>