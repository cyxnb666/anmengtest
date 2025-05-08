<template>
  <div>
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      label-position="left"
      class="common-form-main add-base-info-form"
      @submit.native.prevent
      :disabled="disabled"
      :label-width="formLabelWidth"
    >
      <el-row :gutter="80">
        <el-col :span="12">
          <el-form-item
            label="规则名称："
            prop="ruleName"
          >
            <el-input
              v-model="form.ruleName"
              clearable
              maxlength="20"
              show-word-limit
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="规则所属机构："
            prop="comCode"
          >
            <search-org
              :data.sync="form.comCode"
              :disabled="disabled"
              v-bind="$attrs"
              :hasView="!disabled"
              :hasDel="!disabled"
              class="org-line"
              @clearValidate="clearValidate"
            ></search-org>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="80">
        <el-col :span="12">
          <el-form-item
            label="规则节点："
            prop="ruleNode"
          >
            <el-select
              clearable
              placeholder="请选择规则节点"
              v-model="form.ruleNode"
              filterable
              :disabled="isSon"
            >
              <el-option
                v-for="item in ruleNodeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="险种："
            prop="riskCode"
          >
            <el-select
              clearable
              placeholder="请选择险种"
              v-model="form.riskCode"
              filterable
              :disabled="isSon"
              @change="handlerChangeRisk"
            >
              <el-option
                v-for="item in riskOptions"
                :key="item.riskCode"
                :label="`${item.riskName}`"
                :value="item.riskCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="80">
        <!-- <el-col :span="12">
          <el-form-item
            label="损失数量："
            prop="growingNum"
          >
            <input-number
              v-model="form.growingNum"
              clearable
              maxlength="20"
              show-word-limit
              size='small'
              :step="1"
              step-strictly
              :min='0'
              :max="999999999"
              placeholder="请输入"
            />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item
            label="承保条款："
            prop="clauseCode"
          >
            <el-select
              clearable
              placeholder="请选择条款"
              v-model="form.clauseCode"
              multiple
              :title="getTitle(termOptions, form.clauseCode, true)"
              class="clauseCode-select"
              filterable
            >
              <el-option
                v-for="item in termOptions"
                :key="item.id"
                :label="`${item.version}_${item.clauseName}`"
                :value="item.version"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="规则描述："
            prop="ruleDesc"
          >
            <el-input
              v-model="form.ruleDesc"
              clearable
              maxlength="100"
              show-word-limit
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="80">

        <!-- <el-col :span="12">
          <el-form-item
            label="损失金额："
            prop="growingSum"
          >
            <input-number
              v-model="form.growingSum"
              clearable
              size='small'
              maxlength="20"
              show-word-limit
              
              :step="1"
              step-strictly
              :min='0'
              :max="999999999"
              placeholder="请输入"
            />
          </el-form-item>
        </el-col> -->
        <!-- <el-col :span="12">

          <el-form-item
            label="被保险人满期赔付率："
            prop="recognizeeLossRation"
          >
            <input-number
              v-model="form.recognizeeLossRation"
              clearable
              :precision="2"
              :min="0.01"
              :max='100'
              show-word-limit
              size='small'
              :step="0.01"
              placeholder="请输入"
            />
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row :gutter="80">
        <el-col :span="12">
  <el-form-item
    label="保单类型："
    prop="policyType" 
  >
    <el-select
      clearable
      placeholder="请选择保单类型"
      v-model="form.policyType"
      filterable
    >
      <el-option
        v-for="item in policyTypeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </el-form-item>
</el-col>

      </el-row>
    </el-form>
  </div>
</template>
<script>
import { ruleNodeOptions } from "@/config/options";
import { deepClone } from "@/utils";
import { getObjLabel, isJSON } from "@/utils/tools";
export default {
  props: {
    disabled: {},
    baseInfo: {},
    riskOptions: {},
    isSon: {},
  },
  data() {
    return {
      testTerm: "",
      formLabelWidth: "165px",
      policyTypeOptions: [
      { label: '个体', value: 'individual' },
      { label: '集体', value: 'group' },
      { label: '企业', value: 'enterprise' }
    ],
      form: {
        comCode: [],
        clauseCode: [],
        policyType: ''
      },
      rules: {
        // growingNum: {
        //   required: true,
        //   message: "请输入损失数量",
        //   trigger: "blur",
        // },
        // growingSum: {
        //   required: true,
        //   message: "请输入损失金额",
        //   trigger: "blur",
        // },
        // recognizeeLossRation: {
        //   required: true,
        //   message: "请输入满期赔付率",
        //   trigger: "blur",
        // },
        ruleName: {
          required: true,
          message: "请输入规则名称",
          trigger: "blur",
        },
        comCode: {
          required: true,
          message: "请选择规则所属机构",
          trigger: "blur",
        },
        ruleNode: {
          required: true,
          message: "请选择规则节点",
          trigger: "change",
        },
        clauseCode: {
          required: true,
          message: "请选择条款",
          trigger: "change",
        },
        riskCode: {
          required: true,
          message: "请选择险种",
          trigger: "change",
        },
        policyType: {
    required: true,
    message: "请选择保单类型",
    trigger: "change"
  }
      },
      ruleNodeOptions,
      termOptions: [],
    };
  },
  watch: {
    baseInfo: {
      handler(val) {
        if (val) {
          this.form = { ...deepClone(this.form), ...deepClone(val) };
          if (this.form.riskCode) {
            this.handlerChangeRisk(this.form.riskCode, true);
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    toNumber(growingNum) {
      return growingNum ? Number(growingNum) : 0;
    },
    handlerTest() {
      if (this.testTerm && isJSON(this.testTerm)) {
        this.form.clauseCode = JSON.parse(this.testTerm);
        console.log("设置条款成功");
      } else {
        console.log("没有设置");
      }
    },
    getDefaultProp(type) {
      let { label = "label", value = "value" } =
        this.defaultValueProp[type] || {};
      return { label, value };
    },
    getTitle(arr = [], val, isArr = false) {
      let result = "";
      result = getObjLabel(
        {
          val,
          isArr,
          arr,
          value: "version",
        },
        true
      );
      if (!this.disabled) {
        return;
      }
      return result.map((it) => it.label).join("、");
    },
    clearValidate() {
      this.$refs.form.clearValidate();
    },
    //sign=true为提交
    validateForm(sign = false) {
      return new Promise((resolve, reject) => {
        if (sign) {
          this.$refs.form.validate((valid) => {
            if (valid) {
              resolve({ ...this.form });
            } else {
              reject();
            }
          });
        } else {
          resolve({ ...this.form });
        }
      });
    },
    //获取条款
    getTerm() {
      let { riskCode } = this.form;
      if (riskCode) {
        this.$api("base/selectClause", { riskCodeList: [riskCode] }).then(
          (res) => {
            let list = res.data || [];
            let arr=[]
            list.forEach((it) => {
              arr.push(it.version)
              it.label = `${it.version}_${it.clauseName}`;
            });
            this.termOptions = list;
            // if(this.isDev&&!this.disabled){
            //   this.form.clauseCode=arr
            // }
          }
        );
      }
    },
    handlerChangeRisk(e, isInit = false) {
      if (!isInit) {
        this.form.clauseCode = [];
      }
      this.getTerm();
    },
  },
};
</script>
<style scoped lang="scss">
.add-base-info-form {
  ::v-deep {
    .clauseCode-select {
      .el-select__tags-text {
        display: inline-block;
        width: 400px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: top;
      }
    }
    .el-input-number {
      width: 100%;
    }
    .org-line {
      // flex: 1;
    }
    .org-look {
      width: 100px;
    }
  }
}
</style>
