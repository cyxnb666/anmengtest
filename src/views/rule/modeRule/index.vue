<template>
    <div class="mode-rule">
      <el-card>
        <tb-search
          ref="tbSearch"
          :conditions="conditions"
          @search="search"
          :noPadding="true"
          :hasClearBtn="false"
          class="search-top"
          :loading="loading"
          searchText="快速测试"
        >
          <el-button
            type="primary"
            :loading="loading"
            size="small"
            slot="customBtns"
            @click="setData()"
          >
            设置JSON数据
          </el-button>
        </tb-search>
        <div class="result-title-line mb20">
          输入调试数据
        </div>
        <div class="table-main">
          <tb-table
            ref="tbTable"
            :table-title="tableTitle"
            border
            :hasPagination="false"
            :hasHandler="false"
            :table-data="tableData"
          >
            <el-table-column
              align="center"
              slot="value"
              :label="data.label"
              slot-scope="{ data }"
            >
              <template slot-scope="{ row }">
                <el-input
                  placeholder="请输入"
                  :disabled="loading"
                  :autosize="{ minRows: 1, maxRows: 4 }"
                  v-model.trim="row.value"
                  size="mini"
                  type="textarea"
                  clearable
                ></el-input>
              </template>
            </el-table-column>
          </tb-table>
        </div>
        <div class="result-title mb20">
          <div class="result-title-line mb10">
            测试结果
          </div>
          <div class="flex-v" v-show="resultStatus.code">
            <div class="flex-v mr10">
              <span>状态码：</span>
              <span class="status">{{ resultStatus.code }}</span>
            </div>
            <div class="flex-v mr10">
              <span>耗时：</span>
              <span class="status">{{ resultStatus.time }}ms</span>
            </div>
            <!-- <div class="flex-v mr10">
              <span>是否通过：</span>
              <span :class="[resultStatus.ruleStatus ? 'status' : 'error']">
                {{ resultStatus.ruleStatus ? '通过' : '不通过' }}
              </span>
            </div> -->
            <div class="flex-v mr10">
              <span>执行结果：</span>
              <span :class="[resultStatus.status == '1' ? 'status' : 'error']">
                {{ getStatusTitle(resultStatus.status) }}
              </span>
            </div>
            <div class="flex-v" v-show="resultStatus.error">
              <span>错误提示：</span>
              <span class="error">{{ resultStatus.error }}</span>
            </div>
          </div>
        </div>
        <div>
          <ConfigInfo
            ref="configEl"
            :isResult="true"
            :isMode="true"
            :resultDataList="resultDataList"
            :configRule="configInfoData"
            :configRule.sync="configInfoData"
            :disabled="disabled"
            :functionOptions="cmpOptions.functionOptions"
            :constantOptions="cmpOptions.constantOptions"
            :factorOptions="cmpOptions.factorOptions"
          />
        </div>
      </el-card>
      <JsonData
        :isChild="true"
        :content="jsonStrData"
        jsonSign="set"
        @setRuleJson="setRuleJson"
        v-if="jsonVisible"
        v-model="jsonVisible"
      />
    </div>
  </template>
  <script>
  import { getToken } from '@/utils/auth'
  import { dataToJson, format, isJSON } from '@/utils/tools'
  import { getDivisorData } from '@/components/configInfo/components/utils'
  import ConfigInfo from '@/components/configInfo'
  import { deepClone } from '@/utils'
  import dayjs from 'dayjs'
  import JsonData from '../ruleManagement/components/jsonData.vue'
  import { ruleExecResultOptions } from '@/config/options'
  
  export default {
    data() {
      return {
        jsonVisible: false,
        resultDataList: [], //执行结果
        jsonData: {},
        //测试json数据
        jsonStrData: `{}`,
        resultStatus: {
          code: '',
          time: '',
          error: '',
          status: '',
        },
  
        handlerRow: {},
        configInfoData: [],
        tableData: [],
        disabled: true,
        cmpOptions: {
          factorOptions: [], //因子
          functionOptions: [], //函数
          constantOptions: [], //常量
        },
        resultContent: ``,
        loading: false,
        map: {},
        searchData: {},
        tableTitle: [
          {
            label: '序号',
            width: '70',
            type: 'index',
          },
          {
            label: '参数code',
            width: '300',
            prop: 'divisorCode',
          },
          {
            label: '参数名称',
            width: '300',
            prop: 'divisorName',
          },
          {
            label: '请输入参数值',
            slot: 'value',
          },
        ],
        conditions: [
          {
            prop: 'ruleName',
            type: 'text',
            label: '规则名称',
            clearable: false,
            disabled: true,
            value: '',
          },
        ],
      }
    },
    computed: {},
    components: {
      ConfigInfo,
      JsonData,
    },
    created() {
      this.getOptions()
    },
    mounted() {
      this.$nextTick(() => {
        let query = this.$route.query
        if (query && query.data) {
          this.init(query)
        }
      })
    },
    methods: {
      getStatusTitle(status) {
        if (status) {
          const obj = {
            '0': '异常',
            '1': '通过',
            '2': '暂停',
            '4': '不通过',
          }
          return obj[status]
        }
        return ''
      },
      isTrue(status) {
        return status === '1'
      },
  
      setData() {
        if (this.tableData?.length) {
          let config = { ...this.jsonData }
          this.tableData.forEach((v) => {
            let val = v.value
            config[v.divisorCode] = isJSON(val) ? JSON.parse(val) : val
          })
          this.jsonStrData = JSON.stringify(config)
        }
        this.jsonVisible = true
      },
      //设置json数据
      setRuleJson(content) {
        console.log(content, 'content')
        this.jsonData = content
        this.tableData.forEach((v) => {
          let val = content[v.divisorCode]
          if (typeof val === 'object' && val) {
            val = JSON.stringify(val)
          }
          v.value = val
        })
      },
      toBack() {
        this.$router.push('/rule-management/rule')
      },
      // 回显数据
      setRuleValue(ruleConditionData) {
        let configData = deepClone(ruleConditionData)
        this.$nextTick(() => {
          if (this.$refs.configEl) {
            let config = deepClone(this.$refs.configEl.initRule)
            if (!Array.isArray(configData)) {
              config.configData = configData
              configData = [config]
            }
            this.configInfoData = configData
            this.$nextTick(() => {
              this.$refs.configEl.setContentVal()
            })
          }
        })
      },
      //设置表格数据
      setTableValue(data) {
        let divisorData = getDivisorData(data, this.cmpOptions.factorOptions)
        this.tableData = divisorData.map((it) => {
          return {
            ...it,
            value: '',
          }
        })
        if (!this.tableData.some((v) => v.divisorCode == 'imageData')) {
          this.tableData.push({
            divisorCode: 'imageData',
            divisorName: '影像照片',
            value: '',
          })
        }
      },
      init(query) {
        let data = JSON.parse(query.data || '{}')
        let { dataSource, testId, groupCode, parentId } = data
        console.log(data, 'data')
        if (!testId) return
        this.loading = true
        let isSon = dataSource !== 'agriRule'
        let url = !isSon
          ? 'rules/queryAgriRuleList'
          : 'rules/queryAgriRuleSonList'
        this.$api(url, {
          currentPage: 1,
          id: isSon ? parentId : testId,
          pageSize: 999999,
        })
          .then((res) => {
            console.log(res, 'res')
            let list = res.data.list || []
            let hasItem = list.find((v) => v.id == testId)
            if (hasItem) {
              this.handlerRow = dataToJson(hasItem)
              let {
                ruleName,
                comCode,
                clauseCode,
                riskCode,
                ruleNode,
                ruleConditionData,
              } = this.handlerRow
              console.log(this.handlerRow, ' this.handlerRow')
              this.setRuleValue(ruleConditionData)
              this.setTableValue(ruleConditionData)
  
              this.searchData = {
                comCode: comCode?.length ? comCode[0] : '',
                clauseCode: clauseCode?.length ? clauseCode[0] : '',
                node: ruleNode,
                riskCode,
                dataSource,
                testId,
              }
              this.$nextTick(() => {
                this.$refs.tbSearch.setConditionVal('ruleName', ruleName, 'value')
              })
            }
          })
          .finally(() => {
            this.loading = false
          })
      },
      search(map) {
        this.map = map
  
        this.submit()
      },
      calcTime(startTime) {
        const date1 = dayjs(startTime)
        const date2 = dayjs(+new Date())
        this.resultStatus.time = date2.diff(date1)
      },
      //获取下拉接口
      getOptions() {
        let arr = [
          {
            url: 'base/queryAllTarget',
            key: 'functionOptions',
          },
          {
            url: 'rules/queryAgriDivisorAll',
            key: 'factorOptions',
          },
          {
            url: 'base/pageAllConstant',
            key: 'constantOptions',
          },
        ]
        arr.forEach((v) => {
          this.$api(v.url).then((res) => {
            this.cmpOptions[v.key] = res.data || []
          })
        })
      },
      submit() {
        let data = {}
        this.tableData.forEach((v) => {
          data[v.divisorCode] = v.value || ''
        })
        this.resultContent = ''
        let startTime = +new Date()
        this.loading = true
        this.resultStatus = {
          code: '',
          time: '',
          error: '',
        }
        let { clauseCode, comCode, node, riskCode } = this.searchData
        let jsonData = this.jsonData
        let searchData = {
          ...this.searchData,
          comCode: jsonData.comCode || comCode,
          node: jsonData.node || node,
          riskCode: jsonData.riskCode || riskCode,
          clauseCode: jsonData.clauseCode || clauseCode,
        }
        let userCode = getToken() ? getToken().userCode : ''
        let date = +new Date()
        const config = {
          ...searchData,
          ...this.map,
          ...data,
          prdFlag: this.isDev?'0':'0',
          registNo: `${userCode}_${date}`,
          policyNo: userCode,
          checkSubmitTime: format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        }
        this.resultDataList = []
        this.$api('rules/excuteAgriRule', config)
          .then((res) => {
            /* status： 处理节点的状态 0： 异常， 1： 成功， 2： 暂停
            ruleStatus： 规则执行状态 1： 通过， 2： 不通过 
            executeResult： 规则执行结果详细信息 当executeStatus为1是时， 可以不传， 或者固定为通过； 当为2时， 传不通过的原因 */
            /* const obj = {
            '0': '异常',
            '1': '通过',
            '2': '暂停',
            '4': '不通过',
          } */
            let { ruleStatus, divisor, logMsg } = res.data
            let resStatus = res.data.status
            let status = '1'
            if (ruleStatus != '1') {
              if (resStatus == '1') {
                status = '4'
              } else {
                status = resStatus
              }
            }
            console.log(status, 'status')
            this.resultStatus.code = 200
            this.resultStatus.ruleStatus = ruleStatus == '1'
            let divisorData = divisor || []
            this.resultDataList = divisorData.filter(Boolean)
            this.resultStatus.status = status
            this.$message.success('操作成功')
            if (logMsg) {
              this.resultStatus.error = logMsg
            }
          })
          .catch((err) => {
            console.log(err, 'err')
            this.resultStatus.status = '3'
            this.resultStatus.code = err.code || '500'
            this.resultStatus.error = err.error || '请求异常'
          })
          .finally(() => {
            this.calcTime(startTime)
            this.loading = false
          })
      },
    },
  }
  </script>
  <style scoped lang="scss">
  .mode-rule {
    .mt20 {
      margin-bottom: 20px;
    }
    .mt10 {
      margin-bottom: 10px;
    }
    .mr10 {
      margin-right: 10px;
    }
    .mb20 {
      margin-bottom: 20px;
    }
    .mb10 {
      margin-bottom: 10px;
    }
    .back-btn {
      margin-left: 10px;
    }
    .line-box {
      display: flex;
      & > div {
        width: 50%;
      }
      & > div:first-child {
        margin-right: 20px;
      }
    }
    .result-title {
      font-size: 14px;
    }
    .result-title-line {
      font-size: 16px;
    }
    .status {
      color: #b5d66c;
    }
    .error {
      color: #f00;
    }
    .table-main {
      padding-right: 200px;
    }
  }
  </style>
  