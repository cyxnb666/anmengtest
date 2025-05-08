<template>
  <div class="add-cmp-campaign">
    <el-card class="mb20">
      <div class="btn-list">
        <div>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>审核权限规则配置</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div>
          <el-button type="primary" :loading="loading" v-if="!isDetailDisabled" size="mini" @click="handlerSave">
            确定
          </el-button>
          <el-button type="info" @click="returnTable" size="mini">
            取消
          </el-button>
        </div>
      </div>
    </el-card>
    <el-card>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="common-form-main" :disabled="disabled"
        label-position="left">
        <!-- 机构 -->
        <el-form-item label="机构：" prop="comCode">
          <search-org :data.sync="form.comCode" :disabled="disabled" v-bind="$attrs" :hasView="false"
            :hasDel="!disabled" class="org-line" @clearValidate="clearValidate" />
        </el-form-item>

        <!-- 险种 -->
        <el-form-item label="险种：" prop="riskCode">
          <el-select v-model="form.riskCode" placeholder="请选择险种" clearable filterable style="width: 100%">
            <el-option v-for="item in riskOptions" :key="item.riskCode" :label="`${item.riskName}`"
              :value="item.riskCode" />
          </el-select>
        </el-form-item>

        <!-- 保险性质 -->
        <el-form-item label="保险性质：" prop="insuranceNature">
          <el-select v-model="form.insuranceNature" placeholder="请选择保险性质" clearable style="width: 100%">
            <el-option v-for="item in insuranceNatureOptions" :key="item.value" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>

        <!-- 金额限制项 -->
        <el-form-item v-for="(item, index) in limitFields" :key="index" :label="item.label + '：'" :prop="item.prop">
          <div class="limit-input-group">
            <el-select v-model="form[item.prop].operator" style="width: 80px">
              <el-option label="≤" value="le" />
              <el-option label="≥" value="ge" />
              <el-option label="=" value="eq" />
              <el-option label="<" value="lt" />
              <el-option label=">" value="gt" />
            </el-select>
            <input-number v-model="form[item.prop].value" :min="0" :max="999999999" :precision="2"
              style="width: calc(100% - 90px)" placeholder="请输入金额" />
          </div>
        </el-form-item>

        <!-- 备注 -->
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="2" maxlength="100" show-word-limit
            placeholder="请输入备注" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { insuranceNatureOptions } from '@/config/options'
import { deepClone } from "@/utils"

export default {
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
    // 至少填写一项金额限制的验证
    const validateLimitFields = (rule, value, callback) => {
      // 检查是否至少有一个字段填写了值
      const hasValue = [
        'singlePremiumLimit',
        'annualPremiumLimit',
        'singleAmountLimit',
        'annualAmountLimit'
      ].some(field => {
        return this.form[field]?.value !== undefined && this.form[field]?.value !== '';
      });

      if (!hasValue) {
        callback(new Error('请至少填写一项金额限制'));
      } else {
        callback();
      }
    };

    return {
      loading: false,
      insuranceNatureOptions,
      form: {
        comCode: [], // 机构
        riskCode: '', // 险种
        insuranceNature: '', // 保险性质
        remark: '', // 备注
        // 金额限制字段
        singlePremiumLimit: { operator: 'le', value: undefined },
        annualPremiumLimit: { operator: 'le', value: undefined },
        singleAmountLimit: { operator: 'le', value: undefined },
        annualAmountLimit: { operator: 'le', value: undefined }
      },
      rules: {
        comCode: [{ required: true, message: '请选择机构' }],
        riskCode: [{ required: true, message: '请选择险种' }],
        insuranceNature: [{ required: true, message: '请选择保险性质' }],
        // 添加至少填写一项的验证
        singlePremiumLimit: [{ validator: validateLimitFields, trigger: 'blur' }],
      },
      limitFields: [
        { label: '单笔保费限额', prop: 'singlePremiumLimit' },
        { label: '累计保费限额', prop: 'annualPremiumLimit' },
        { label: '单笔保额限额', prop: 'singleAmountLimit' },
        { label: '累计保额限额', prop: 'annualAmountLimit' }
      ]
    }
  },
  computed: {
    isDetailDisabled({ handlerSign }) {
      return handlerSign == "view";
    }
  },
  watch: {
        handlerRow: {
            handler(val) {
              console.log(val)
                if (val?.configId && this.handlerSign != "add") {
                    this.init(val);
                }
            },
            immediate: true,
            deep: true,
        }
    },
  methods: {
    init(val) {
      this.setValue(val);
    },
    setValue(detail) {
      const data = deepClone(detail);
      console.log(data)

      const processLimitValue = (value) => {
        return value === null ? undefined : value;
      }

      this.form = {
        // 处理机构数据 - 从deptList中提取comcode数组
        comCode: data.deptList ? data.deptList.map(item => item.comcode) : [],

        // 处理险种数据 - 从riskConfig中提取
        riskCode: data.riskConfig?.riskCode || '',

        // 保险性质 - 从tnatureConfig中提取
        insuranceNature: data.tnatureConfig?.natureCode || '',

        // 备注
        remark: data.remark || '',

        // 处理各个限额数据
        singlePremiumLimit: {
          operator: data.singleLimitSection || 'lte',
          value: processLimitValue(data.singleLimitPremium)
        },

        annualPremiumLimit: {
          operator: data.accLimitSection || 'lte',
          value: processLimitValue(data.accLimitPremium)
        },

        singleAmountLimit: {
          operator: data.singleCoverageSection || 'lte',
          value: processLimitValue(data.singleLimitCoverage)
        },

        annualAmountLimit: {
          operator: data.accCoverageSection || 'lte',
          value: processLimitValue(data.accLimitCoverage)
        }
      };
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
          // 构造基础参数对象
          const params = {
            // 机构列表
            deptList: this.form.comCode.map(code => ({
              comcode: code
            })),

            // 险种配置
            riskConfig: {
              riskCode: this.form.riskCode
            },

            // 保险性质
            tnatureConfig: {
              natureCode: this.form.insuranceNature
            },

            // 备注
            remark: this.form.remark,
          };

          // 只添加实际填写的限额字段到参数中
          if (this.form.singlePremiumLimit.value !== undefined) {
            params.singleLimitSection = this.form.singlePremiumLimit.operator;
            params.singleLimitPremium = this.form.singlePremiumLimit.value;
          }

          if (this.form.annualPremiumLimit.value !== undefined) {
            params.accLimitSection = this.form.annualPremiumLimit.operator;
            params.accLimitPremium = this.form.annualPremiumLimit.value;
          }

          if (this.form.singleAmountLimit.value !== undefined) {
            params.singleCoverageSection = this.form.singleAmountLimit.operator;
            params.singleLimitCoverage = this.form.singleAmountLimit.value;
          }

          if (this.form.annualAmountLimit.value !== undefined) {
            params.accCoverageSection = this.form.annualAmountLimit.operator;
            params.accLimitCoverage = this.form.annualAmountLimit.value;
          }

          // 如果是编辑模式,需要带上configId
          if (this.handlerSign === 'change') {
            params.configId = this.handlerRow.configId;
          }

          this.loading = true;

          // 根据操作类型选择不同的API路径
          const apiUrl = this.handlerSign === 'add'
            ? 'limits/saveCommonConfig'    // 新增接口
            : 'limits/updateCommonConfig'; // 修改接口

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
    }
  }
}
</script>

<style scoped lang="scss">
.add-cmp-campaign {
  .mb20 {
    margin-bottom: 15px;
  }

  .btn-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .limit-input-group {
    display: flex;
    align-items: center;
    gap: 10px;
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
