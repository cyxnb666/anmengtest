<template>
  <t-dialog
    v-bind="$attrs"
    v-on="$listeners"
    v-model="dialogVisible"
    title="版本历史记录"
    :disabled="disabled"
    append-to-body
    width="1400px"
    :closeOnClickModal="true"
    :footerSlot="true"
  >
    <div class="add-user-main">
      <tb-search
        ref="tbSearch"
        :conditions="conditions"
        :loading="loading"
        @search="search"
        :noPadding="true"
        class="search-top"
      ></tb-search>
      <tb-table
        ref="tbTable"
        :loading="loading"
        :handler-btns="handlerBtns"
        :pager-config="pagerConfig"
        :table-title="tableTitle"
        @handlerChange="handlerChange"
        border
        handlerWith="300"
        @handlerCopy="handlerCopy"
        :table-data="tableData"
        @loadPage="loadPage"
      >
        <el-table-column
          align="center"
          slot="ruleVersion"
          :label="data.label"
          width="80"
          slot-scope="{ data }"
        >
          <!-- 版本号 -->
          <template slot-scope="{ row }">
            {{ row.ruleVersion ? 'V' + row.ruleVersion : '' }}
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
       
        <template slot="handlerRelease" slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            :disabled="isDisabled(row, 'release')"
            @click="handlerRelease({ row })"
          >
            {{ getReleaseControl(row).label }}
          </el-button>
        </template>
        <template slot="handlerChange" slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            :disabled="isDisabled(row, 'change')"
            @click="handlerChange({ row, sign: 'change' })"
          >
            编辑
          </el-button>
        </template>
        <template slot="del" slot-scope="{ row }">

          <el-button
            type="text"
            size="small"
            :disabled="isDisabled(row, 'delete')" 
            @click="handlerDel({ row })"
          >
            删除
          </el-button>
        </template>
      </tb-table>
      <publishCmp
        :title="handlerControlSign === 'publish' ? '确认发布' : '确认下架'"
        :loading="loading"
        @handlerPublish="handlerPublish"
        v-if="handlerControlVisible"
        v-model="handlerControlVisible"
      />
    </div>
  </t-dialog>
</template>
<script>
import {
  getCurrentPage,
  deepClone,
  dataToJson,
  getObjLabel,
} from '@/utils/tools'
import { ruleStatusOptions } from '@/config/options'
import publishCmp from '@/components/PublishCmp/publishCmp'
export default {
  props: {
    handlerCurrentPage: {},
    visible: {},
    disabled: {},
    handlerRow: {
      type: Object,
      default: () => {},
    },
    handlerSign: {
      type: String,
      default: 'add',
    },
    useVCode: {},
  },
  model: {
    prop: 'visible',
    event: 'change',
  },
  data() {
    return {
      handlerExaVisible: false,
      handlerLineRow: {},
      handlerControlSign: '',
      handlerControlVisible: false,
      dialogVisible: false,
      tableData: [],
      map: {},
      loading: false,
      pagerConfig: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      tableTitle: [
        {
          label: '序号',
          width: '70',
          type: 'index',
        },
        {
          label: '规则名称',
          prop: 'ruleName',
        },
        {
          prop: 'updatedBy',
          label: '更新人',
        },
        /*  {
          prop: 'roleCode',
          label: '更新/修改内容',
        }, */
        {
          slot: 'ruleVersion',
          label: '版本号',
        },
        {
          slot: 'status',
          label: '状态',
        },

        {
          prop: 'publishDate',
          label: '发布时间',
        },
        {
          prop: 'delistDate',
          label: '下架时间',
        },
        {
          prop: 'updateTime',
          label: '更新时间',
        },
      ],
      handlerBtns: [
        {
          label: '查看',
          trigger: 'handlerChange',
          sign: 'view',
        },
        {
          label: '复制',
          trigger: 'handlerCopy',
        },
        {
          label: '下架',
          slot: 'handlerRelease',
        },
        {
          label: '修改',
          slot: 'handlerChange',
        },
        {
          label: '删除',
          slot: 'del',
        },
      ],
      formData: {},
      conditions: [
        /* {
          prop: 'updateContent',
          type: 'text',
          label: '更新内容：',
          clearable: true,
          value: '',
        }, */
        {
          prop: 'publicTime',
          type: 'datetimerange',
          label: '发布时间：',
          clearable: true,
          value: [],
          dateProp: {
            start: 'startDate',
            end: 'endDate',
          },
        },
      ],
    }
  },
  components: {
    publishCmp,
  },
  watch: {
    visible: {
      handler(val) {
        this.dialogVisible = val
      },
      immediate: true,
    },
    dialogVisible(val) {
      this.$emit('change', val)
    },
    handlerRow: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.formData = { ...this.formData, ...val }
            if (this.handlerCurrentPage) {
              this.pagerConfig.currentPage = this.handlerCurrentPage
            }
            this.loadPage()
          })
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handlerPublish(verifyCode) {
      let row = this.handlerLineRow
      let { label, sign } = this.getReleaseControl(row)
      let url =
        sign === 'publish'
          ? 'rules/publishAgriRuleSon'
          : 'rules/delistAgriRuleSon'
      this.loading = true
      this.$api(url, {
        id: row.id,
        groupCode: row.groupCode,
        verifyCode,
        parentId: row.parentId,
      })
        .then(() => {
          this.$message.success('操作成功')
          this.handlerControlVisible = false
          this.$emit('getList')
          this.loadPage()
        })
        .finally(() => {
          this.loading = false
        })
    },
    //发布、下架
    handlerRelease({ row }) {
      this.handlerLineRow = deepClone(row)
      let { label, sign } = this.getReleaseControl(row)
      this.handlerControlSign = sign
      if (!this.useVCode) {
        this.handlerReleaseFn(label)
      } else {
        this.handlerControlVisible = true
      }
    },
    handlerReleaseFn(label) {
      this.$confirm(`确认${label}该规则?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.handlerPublish()
      })
    },
    getReleaseControl({ ruleState }) {
      const releaseArr = ['hisPublish', 'notPublish', 'delist']
      return releaseArr.includes(ruleState)
        ? { label: '发布', sign: 'publish' }
        : { label: '下架', sign: 'delist' }
    },
    //复制
    handlerCopy({ row }) {
      this.$confirm(`确认复制该规则?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.loading = true
        this.$api('rules/copyAgriRuleSon', { id: row.id })
          .then(() => {
            this.$message.success('复制成功')
            this.loadPage()
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    // 删除
    handlerDel({ row }) {
      this.$confirm(`确认删除该项?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.loading = true
        this.$api('rules/deleteAgriRuleSon', { id: row.id })
          .then(() => {
            this.$message.success('删除成功')
            const { currentPage, total, pageSize } = this.pagerConfig
            this.pagerConfig.currentPage = getCurrentPage({
              total,
              size: pageSize,
              current: currentPage,
            })

            this.loadPage()
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    // 新增、更改用户
    handlerChange({ row, sign }) {
      this.dialogVisible = false
      let data = { ...row }
      console.log(row, 'row')
      if (!data.parentId) {
        data.parentId = this.handlerRow.id
      }
      this.$emit('handlerHistoryChange', {
        row: data,
        sign,
        currentPage: this.pagerConfig.currentPage,
        handlerFatherRow: this.handlerRow,
        handlerType: 'son',
      })
    },
    isDisabled(row, sign) {
      const obj = {
        release: ['notPublish', 'hisPublish', 'running', 'delist'],
        delete: ['temporary', 'notPublish'],
        change: ['temporary', 'notPublish'],
      }
      let data = obj[sign] || []
      return !data.includes(row.ruleState)
    },
    search(map) {
      this.map = map
      this.pagerConfig.currentPage = 1
      this.loadPage()
    },
    handlerControl({ row }) {
      this.handlerLineRow = deepClone(row)
      this.handlerExaVisible = true
    },
    loadPage() {
      this.loading = true
      const config = {
        ...this.map,
        groupCode: this.handlerRow.groupCode,
        id: this.handlerRow.id,
        currentPage: this.pagerConfig.currentPage,
        pageSize: this.pagerConfig.pageSize,
      }
      this.$api('rules/queryAgriRuleSonList', config)
        .then((res) => {
          if (res.code === 200) {
            let list = res.data.list || []
            list.forEach((it) => {
              let statusConfig = getObjLabel(
                {
                  val: it.ruleState,
                  arr: ruleStatusOptions,
                },
                true,
              )
              it.statusConfig = statusConfig
            })
            this.tableData = dataToJson(list)
            this.pagerConfig.total = res.data.total || 0
            this.pagerConfig.currentPage=res.data.pageNum||1
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
<style scoped lang="scss"></style>
