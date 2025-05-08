<template>
  <div class="add-cmp-campaign">
    <el-card class="mb20">
      <div class="btn-list">
        <div>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>规则管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div>
          <el-button
            type="primary"
            :loading="loading"
            v-if="!isDetailDisabled"
            size="mini"
            @click="handlerSave('commit')"
          >
            提交
          </el-button>
          <el-button
            type="primary"
            :loading="loading"
            v-if="!isDetailDisabled"
            size="mini"
            @click="handlerSave('temporary')"
          >
            暂存
          </el-button>
          <el-button
            type="primary"
            :loading="loading"
            size="mini"
            @click="getRule('get')"
          >
            JSON数据
          </el-button>
          <el-button
            type="primary"
            :loading="loading"
            size="mini"
            :disabled="isDetailDisabled"
            @click="getRule('set')"
          >
            设置JSON数据
          </el-button>
          <el-button
            type="primary"
            :loading="loading"
            size="mini"
            :disabled="ruleState == 'temporary'"
            @click="modeRule()"
          >
            规则执行
          </el-button>
          <el-button
            type="info"
            @click="returnTable"
            size="mini"
          >
            取消
          </el-button>
        </div>
      </div>
    </el-card>
    <el-card>
      <con-title text="规则信息">
        <BaseInfo
          ref="baseInfoEl"
          v-bind="$attrs"
          :base-info="form"
          :isSon="isSon"
          :disabled="isDetailDisabled"
          v-if="defer(1)"
        />
      </con-title>

      <con-title text="配置条件">
        <ConfigInfo
          ref="configEl"
          :configRule="configInfoData"
          :configRule.sync="configInfoData"
          :disabled="isDetailDisabled"
          :factorOptions="factorOptions"
          v-bind="$attrs"
        />
      </con-title>
    </el-card>

    <el-backtop></el-backtop>
    <JsonData
      :content="content"
      :jsonSign="jsonSign"
      :expressData="expressData"
      v-if="jsonVisible"
      v-model="jsonVisible"
    />
  </div>
</template>
<script>
import { deepClone } from "@/utils";
import { debounce, getObjLabel } from "@/utils/tools";
import { opOptions } from "@/config/rule";
import ConfigInfo from "@/components/configInfo";
import BaseInfo from "./components/baseInfo";
import { getExpress } from "@/utils/rule";
import JsonData from "./components/jsonData.vue";
import Defer from "@/mixins/Defer";
import { getDivisorData } from "@/components/configInfo/components/utils";
export default {
  props: {
    //son操作子规则，father操作主规则
    handlerType: {},
    //页面标识
    handlerPageSign: {},
    handlerSign: {
      default: "add",
    },
    handlerRow: {},
    detailDisabled: {},
    factorOptions: {},
  },
  components: {
    ConfigInfo,
    BaseInfo,
    JsonData,
  },
  mixins: [Defer()],
  data() {
    return {
      ruleState: "temporary",
      jsonSign: "",
      modeVisible: false,
      jsonVisible: false,
      form: {},
      factorOptionsCurrent: [],
      loading: false,
      handlerId: "",
      content: "",
      expressData: "",
      configInfoData: [],
    };
  },
  watch: {
    handlerRow: {
      handler(val) {
        if (val && val.id && this.handlerSign != "add") {
          this.init(val);
        } else {
          this.ruleState = "temporary";
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    title({ handlerSign }) {
      let msg = "规则";
      let handlerMsg = "新增";
      switch (handlerSign) {
        case "change":
          handlerMsg = "编辑";
          break;
        case "view":
          handlerMsg = "查看";
          break;
      }
      return `${handlerMsg}${msg}`;
    },
    isDetailDisabled({ handlerSign }) {
      return handlerSign == "view";
    },
    isSon({ handlerType }) {
      return handlerType === "son";
    },
  },
  mounted() {
    this.$bus.$on("setRuleJson", (e) => {
      this.setRuleValue(e);
    });
  },
  beforeDestroy() {
    this.$bus.$off("setRuleJson");
  },
  methods: {
    init(val) {
      this.handlerId = val.id;
      this.ruleState = val.ruleState;
      this.setValue(val);
    },
    //调试规则
    modeRule() {
      if (this.ruleState == "temporary") {
        return this.$message.error("当前规则处于暂存状态，尚不能进行调试！");
      }
      let dataSource = !this.isSon ? "agriRule" : "agriRuleSon";

      const newPage = this.$router.resolve({
        path: "/dev/modeRule",
        query: {
          data: JSON.stringify({
            dataSource,
            parentId: this.isSon ? this.handlerRow.parentId : "",
            testId: this.handlerId,
            groupCode: this.handlerRow.groupCode,
          }),
        },
      });
      window.open(newPage.href, "_blank");
    },
    //回显配置数据
    setValue(val) {
      let data = deepClone(val);
      console.log(val, "val");
      let {
        ruleName,
        comCode = [],
        ruleNode,
        riskCode,
        ruleDesc,
        clauseCode = [],
        parentId,
        ruleConditionData = {},
        growingNum,
        growingSum,
        recognizeeLossRation,
        policyType = '',
      } = data;

      this.form = {
        ruleName,
        comCode,
        ruleNode,
        riskCode,
        ruleDesc,
        clauseCode,
        parentId,
        growingNum,
        growingSum,
        recognizeeLossRation,
        policyType
      };
      this.handlerId = val.id;
      setTimeout(() => {
        this.setRuleValue(ruleConditionData);
      }, 30);
    },
    setRuleValue(ruleConditionData) {
      let configData = deepClone(ruleConditionData);
      this.$nextTick(() => {
        if (this.$refs.configEl) {
          let config = deepClone(this.$refs.configEl.initRule);
          if (!Array.isArray(configData)) {
            config.configData = configData;
            configData = [config];
          }

          this.configInfoData = configData;
          this.$nextTick(() => {
            this.$refs.configEl.setContentVal();
          });
        }
      });
    },
    getRule(sign) {
      this.jsonVisible = true;
      if (sign === "set") {
        this.jsonSign = sign;
        return;
      }
      this.$refs.configEl.validateForm().then((res) => {
        console.log(res, "规则");
        this.content = "";
        let rule = res;
        let str = JSON.stringify(rule);
        this.content = str;
        let result = getExpress(rule.if.conditions, rule.if.refType);
        this.$nextTick(() => {
          this.expressData = result;
          this.$log(this.expressData);
        });
      });
    },
    //提交数据
    handlerSave: debounce(function (sign) {
      let isSubmit = sign == "commit" ? true : false; //提交
      //校验
      this.$refs.baseInfoEl.validateForm(isSubmit).then((baseInfoData) => {
        this.$refs.configEl.validateForm(isSubmit).then((configInfoData) => {
          console.log(baseInfoData, "baseInfoData");
          console.log(configInfoData, "configInfoData");
          let comCodeData = deepClone(baseInfoData.comCode || []);
          let clauseCodeData = deepClone(baseInfoData.clauseCode || []);
          let comCode = comCodeData.sort();
          let clauseCode = clauseCodeData.sort();
          let divisorData = getDivisorData(configInfoData, this.factorOptions);
          const data = {
            ...baseInfoData,
            comCode: JSON.stringify(comCode),
            clauseCode: JSON.stringify(clauseCode),
            id: this.handlerId,
            ruleConditionData: JSON.stringify(configInfoData),
            operationType: sign,
            divisorData: JSON.stringify(divisorData),
          };
          let url = !this.handlerId
            ? "rules/saveBAgriRule"
            : "rules/updateAgriRule";
          //修改子规则
          if (this.handlerType === "son") {
            url = "rules/updateAgriRuleSon";
          }
          this.loading = true;
          this.$api(url, data)
            .then((res) => {
              this.$emit("getList");
              this.$message.success("操作成功");
              this.ruleState = !isSubmit ? "temporary" : "notPublish";

              if (res?.data?.id) {
                this.handlerId = res.data.id;
              }
              if (isSubmit) {
                // this.returnTable()
              }

              console.log(res, "res");
            })
            .finally(() => {
              this.loading = false;
            });
        });
      });
    }),
    returnTable() {
      if (this.isSon) {
        this.$emit("openChild");
      }
      this.$emit("update:handlerPageSign", "table");
    },
  },
};
</script>
<style scoped lang="scss">
.add-cmp-campaign {
  position: relative;
  .btn-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
