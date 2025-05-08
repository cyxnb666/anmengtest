<template>
  <div class="add-cmp-main">
    <el-card class="mb20">
      <div class="btn-list">
        <div>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>精准承保地块规则配置</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div>
          <!-- 非查看模式才显示确定按钮 -->
          <el-button v-if="!isDetailDisabled" type="primary" :loading="loading" size="mini" @click="handlerSave">
            确定
          </el-button>
          <!-- 查看模式显示"返回"，其他显示"取消" -->
          <el-button type="info" @click="returnTable" size="mini">
            {{ isDetailDisabled ? '返回' : '取消' }}
          </el-button>
        </div>
      </div>
    </el-card>
    <el-card>
      <el-form ref="form" :model="form" :rules="rules" label-width="220px" class="common-form-main" :disabled="disabled"
        label-position="left">
        <!-- 机构 -->
        <el-form-item label="机构：" prop="comCode" required>
          <search-org :data.sync="form.comCode" :disabled="disabled" v-bind="$attrs" :hasView="false"
            :hasDel="!disabled" class="org-line" @clearValidate="clearValidate" placeholder="点击选择机构" />
        </el-form-item>

        <!-- 险种 -->
        <el-form-item label="险种：" prop="riskCode" required>
          <el-select v-model="form.riskCode" placeholder="请选择险种" clearable filterable style="width: 100%"
            @change="handleRiskChange">
            <el-option v-for="item in riskList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <!-- 险类 -->
        <el-form-item label="险类：" prop="insuranceType">
          <el-input v-model="form.insuranceType" placeholder="根据险种自动带出" :disabled="true" style="width: 100%" />
        </el-form-item>

        <!-- 投保数量/地块面积 -->
        <el-form-item :label="form.insuranceType === 'plant' ? '地块面积(亩)：' : '投保数量(头/只)/地块面积(亩)：'" prop="quantity">
          <div class="limit-input-group">
            <el-select v-model="form.quantityOperator" style="width: 80px">
              <el-option label="<" value="lt" />
              <el-option label="<=" value="le" />
              <el-option label="=" value="eq" />
              <el-option label=">=" value="ge" />
              <el-option label=">" value="gt" />
            </el-select>
            <input-number v-model="form.quantity" :min="0" :max="999999999" :precision="2"
              style="width: calc(100% - 90px)" placeholder="输入数量" />
          </div>
        </el-form-item>

        <!-- 勾画面积误差率 -->
        <el-form-item label="勾画面积误差率：" prop="errorRate">
          <div class="limit-input-group">
            <el-select v-model="form.errorRateOperator" style="width: 80px">
              <el-option label="<" value="lt" />
              <el-option label="<=" value="le" />
              <el-option label="=" value="eq" />
              <el-option label=">=" value="ge" />
              <el-option label=">" value="gt" />
            </el-select>
            <input-number v-model="form.errorRate" :min="0" :max="100" :precision="2"
              style="width: calc(100% - 110px); margin-right: 5px" placeholder="请输入" />
            <span style="width: 25px">%</span>
          </div>
        </el-form-item>

        <!-- 投保地址 -->
        <el-form-item label="投保地址：" prop="addressCode" required>
          <search-org :data.sync="form.addressCode" :disabled="disabled" :flatDistrictOptions="flatAddressOptions"
            :districtFirstOptions="addressTreeOptions" v-bind="$attrs" :hasView="false" :hasDel="!disabled"
            class="org-line" @clearValidate="clearValidate" placeholder="点击选择投保地址" />
        </el-form-item>

        <!-- 备注 -->
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="2" maxlength="100" show-word-limit placeholder="请输入" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { deepClone } from "@/utils";

export default {
  name: 'AddCmp',
  props: {
    handlerPageSign: {},
    handlerSign: {
      default: "add"
    },
    handlerRow: {},
    disabled: {
      type: Boolean,
      default: false
    },
    selectOptionsProp: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const validateQuantity = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error(this.form.insuranceType === 'plant' ? '请输入地块面积' : '请输入投保数量'));
      } else {
        callback();
      }
    };

    return {
      loading: false,
      form: {
        comCode: [], // 机构
        riskCode: '', // 险种
        insuranceType: '', // 险类
        quantityOperator: 'gt', // 数量/面积操作符
        quantity: undefined, // 数量/面积值
        errorRateOperator: 'lt', // 误差率操作符
        errorRate: undefined, // 误差率值
        remark: '', // 备注
        addressCode: [], // 投保地址
      },
      flatAddressOptions: [], // 扁平化的地址数据
      addressTreeOptions: [], // 树形地址数据
      areaProps: {
        value: 'areaCode',
        label: 'areaName',
        children: 'children'
      },
      riskList: [],
      rules: {
        comCode: [{ required: true, message: '请选择机构' }],
        riskCode: [{ required: true, message: '请选择险种' }],
        quantity: [{ required: true, validator: validateQuantity, trigger: 'blur' }],
        addressCode: [{ required: true, message: '请选择投保地址' }],
      }
    };
  },
  computed: {
    isDetailDisabled() {
      return this.handlerSign === 'view';
    }
  },
  created() {
    // 获取地址数据
    this.getAddressData();
    // 获取所有险种数据
    this.getAllRiskList();
    this.IsDev = false;
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
    getAddressData() {
      this.$api('plot/selectAreaTree').then(res => {
        if (res.code === 200 && res.data) {
          // 转换树形数据
          const convertTreeData = (data) => {
            return data.map(item => ({
              comCode: item.areaCode,
              comName: item.areaName,
              children: item.children ? convertTreeData(item.children) : []
            }));
          };
          this.addressTreeOptions = convertTreeData(res.data);

          // 生成扁平数据 - 保留父子关系
          const flattenTree = (arr, parent = null) => {
            let result = [];
            arr.forEach(item => {
              const newItem = {
                comCode: item.areaCode,
                comName: item.areaName,
                children: [], // 保留 children 属性
                parent: parent // 可选:添加父节点引用
              };
              result.push(newItem);

              if (item.children && item.children.length) {
                // 保存子节点引用
                newItem.children = flattenTree(item.children, newItem);
                result = result.concat(newItem.children);
              }
            });
            return result;
          };

          this.flatAddressOptions = flattenTree(res.data);
        }
      }).catch(err => {
        console.error('获取地址数据失败:', err);
        this.$message.error('获取地址数据失败');
      });
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

        insuranceType: data.riskConfig?.classesName || '',

        // 处理运算符和数值
        quantityOperator: data.ruleSecition || 'ge',    // 数量/面积运算符
        quantity: data.ruleValue ?? undefined,          // 数量/面积值
        errorRateOperator: data.mistakeSecition || 'lt', // 误差运算符  
        errorRate: data.mistakeValue ?? undefined,      // 误差率值

        // 基础字段
        remark: data.remark || '',

        addressCode: data.areaConfigs ? data.areaConfigs.map(item => item.areaCode) : [],

      };

      // 如果有险种信息,需要获取对应的险类
      if (this.form.riskCode) {
        this.handleRiskChange(this.form.riskCode, true);
      }
    },

    clearValidate() {
      this.$refs.form.clearValidate();
    },

    returnTable() {
      this.$emit("update:handlerPageSign", "table");
    },

    // 险种变更
    handleRiskChange(val, isInit = false) {
      if (!isInit) {
        this.form.insuranceType = '';
      }

      if (val) {
        this.$api("plot/selectClause", {
          riskCodeList: [val]
        }).then(res => {
          if (res.code === 200 && res.data && res.data.length > 0) {
            this.form.insuranceType = res.data[0].classesName || '';
          }
        }).catch(err => {
          console.error("获取险类信息失败:", err);
          this.$message.error("获取险类信息失败");
        });
      }
    },

    getAllRiskList() {
      this.$api("base/selectAllRisk").then((res) => {
        if (res.code === 200) {
          let list = res.data || [];
          this.riskList = list.map(item => ({
            label: `${item.riskName}`,
            value: item.riskCode,
            riskName: item.riskName
          }));
        }
      });
    },


    handlerSave() {
      this.$refs.form.validate(valid => {
        if (valid) {

          // 构造基础参数对象
          const baseParams = {
            deptList: this.form.comCode.map(code => ({
              comcode: code
            })),
            mistakeSecition: this.form.errorRateOperator,
            mistakeValue: this.form.errorRate,
            remark: this.form.remark || '',
            riskConfig: {
              riskCode: this.form.riskCode
            },
            ruleSecition: this.form.quantityOperator,
            ruleValue: this.form.quantity,
            areaConfigs: this.form.addressCode.map(code => ({
              areaCode: code
            })),
          };

          // 如果是编辑，需要带上configId
          const params = this.handlerSign === 'change'
            ? { ...baseParams, configId: this.handlerRow.configId }
            : baseParams;

          this.loading = true;

          // 根据操作类型选择不同的API
          const apiUrl = this.handlerSign === 'change'
            ? 'plot/updateConfig'
            : 'plot/saveConfig';

          this.$api(apiUrl, params)
            .then(() => {
              this.$message.success(`${this.handlerSign === 'change' ? '修改' : '新增'}成功`);
              this.$emit("getList");
              this.returnTable();
            })
            .catch(err => {
              console.error(`${this.handlerSign === 'change' ? '修改' : '新增'}失败:`, err);
              this.$message.error(`${this.handlerSign === 'change' ? '修改' : '新增'}失败`);
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.add-cmp-main {
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