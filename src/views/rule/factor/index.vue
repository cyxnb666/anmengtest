<template>
    <div>
      <tb-search
        ref="tbSearch"
        :conditions="conditions"
        :loading="loading"
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
      <tb-table
        ref="tbTable"
        :loading="loading"
        :pager-config="pagerConfig"
        :handler-btns="handlerBtns"
        :table-title="tableTitle"
        :table-data="tableData"
        @handlerChange="handlerChange"
        @loadPage="loadPage"
      >
        <!-- 状态 -->
        <el-table-column
          align="center"
          slot="status"
          width="100"
          label="状态"
          slot-scope="{ data }"
        >
          <template slot-scope="{ row }">
            <switch-btn
              :row="row"
              statusKey="divisorStatus"
              @getList="loadPage"
              :loading.sync="loading"
              url="rules/updateAgriDivisors"
            ></switch-btn>
          </template>
        </el-table-column>
        <template slot="del" slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            @click="handlerDel({ row })"
            v-if="isDev"
          >
            删除
          </el-button>
        </template>
     
      </tb-table>
      <AddCmp
        v-model="visible"
        v-if="visible"
        :handlerSign="handlerSign"
        :handlerRow="handlerRow"
        @getList="loadPage"
      />
    </div>
  </template>
  <script>
  import conditions from './searchbar'
  import tableTitle, { handlerBtns } from './table'
  import AddCmp from './addCmp.vue'
  import { getCurrentPage, eachLimit,deepClone } from '@/utils/tools'
  import { saveBAgriDivisor } from '@/api/modules/rules'
  export default {
    components: {
      AddCmp,
    },
    data() {
      return {
        loadingSubmit: false,
        treeData: [], // 权限
        loading: false,
        conditions:deepClone(conditions),
        tableTitle,
        handlerBtns,
        visible: false,
        handlerSign: 'add',
        handlerRow: {},
        tableData: [],
        map: {},
        pagerConfig: {
          currentPage: 1,
          total: 0,
          pageSize: 10,
        },
      }
    },
    computed: {
      handlerTitle({ handlerSign }) {
        return handlerSign === 'add' ? '新增角色' : '修改角色'
      },
      // 是否能够修改
      isDisabled({ handlerSign, hasPerm }) {
        return handlerSign === 'change' && !hasPerm('changeRole')
      },
    },
    mounted() {
      this.loadPage()
    },
    methods: {
      // 修改状态
      handlerStatus(data, key) {
        let status = data[key]
        let isValid = status == '1'
        let statusSubmit = isValid ? '0' : '1'
        const msg = isValid ? '禁用' : '启用'
        this.$confirm(`是否将该项${msg}?`, `提示`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.loading = true
          this.$api('rules/updateAgriDivisors', {
            id: data.id,
            divisorStatus: statusSubmit,
          })
            .then(() => {
              this.$message.success('操作成功')
              this.loadPage()
            })
            .finally(() => {
              this.loading = false
            })
        })
      },
      getListStr(list) {
        let str = ''
        list.forEach((it, index) => {
          if (index == 0) {
            str += '{'
          }
          str += `
          "${it.divisorCode}":"",//${it.divisorName}
          `
          if (index == list.length - 1) {
            str += '}'
          }
        })
      },
      // 请求列表
      loadPage() {
        this.loading = true
        this.$api('rules/queryAgriDivisorList', {
          ...this.map,
          currentPage: this.pagerConfig.currentPage,
          pageSize: this.pagerConfig.pageSize,
        })
          .then((res) => {
            let list = res.data.list || []
            this.getListStr(list)
            this.tableData = list
            this.pagerConfig.total = res.data.total || 0
          })
          .finally(() => {
            this.loading = false
          })
      },
      search(map) {
        this.map = map
        this.pagerConfig.currentPage = 1
        this.loadPage()
      },
      // 新增、更改用户
      handlerChange({ row, sign }) {
        this.visible = true
        this.handlerSign = sign
        if (row) {
          this.handlerRow = { ...row }
        }
      },
      // 删除
      handlerDel({ row }) {
        this.$confirm(`确认删除该项?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.loading = true
          this.$api('rules/deleteAgriDivisor', { id: row.id })
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
    },
  }
  </script>
  <style scoped lang="scss"></style>
  