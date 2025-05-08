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
        @handlerDel="handlerDel"
        @loadPage="loadPage"
        handlerWith="300"
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
              statusKey="validStatus"
              @getList="loadPage"
              :loading.sync="loading"
              :customParam="customParam"
              url="user/updateStatus"
            ></switch-btn>
          </template>
        </el-table-column>
        <!-- <template slot="handlerStatus" slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            @click="handlerStatus(row, 'validStatus')"
          >
            {{ row.validStatus !== '1' ? '启用' : '禁用' }}
          </el-button>
        </template> -->
        <template slot="handlerDel" slot-scope="{ row }">
          <el-button type="text" size="small" @click="handlerDel({ row })">
            删除
          </el-button>
        </template>
      </tb-table>
      <component
        :is="handlerSign"
        @getList="loadPage"
        v-if="visible"
        v-model="visible"
        :flatOptions="flatOptions"
        :allMenuList="allMenuList"
        :handlerSign="handlerSign"
        :handlerRow="handlerRow"
      ></component>
    </div>
  </template>
  <script>
  import conditions from './searchbar'
  import tableTitle, { handlerBtns } from './table'
  import addCmp from './components/addCmp.vue'
  import { getCurrentPage ,deepClone} from '@/utils/tools'
  import { flatTree } from '@/utils/tree'
  export default {
    components: {
      add: addCmp,
      change: addCmp,
      addMenu: () => import('./components/addMenu.vue'),
      addRoleUser: () => import('./components/addRoleUser.vue'),
    },
    data() {
      return {
        allMenuList: [],
        flatOptions: [],
        customParam:{
          id:"roleId",
          validStatus:'status'
        },
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
      this.getMenu()
      this.loadPage()
    },
    methods: {
      getMenu() {
        this.loading = true
        this.$api('user/allMenu')
          .then((res) => {
            console.log(res, 'res')
            this.allMenuList = res.data || []
            this.flatOptions = flatTree(this.allMenuList)
          })
          .finally(() => {
            this.loading = false
          })
      },
      // 请求列表
      loadPage() {
        this.loading = true
        this.$api('user/pageRole', {
          ...this.map,
          currentPage: this.pagerConfig.currentPage,
          pageSize: this.pagerConfig.pageSize,
        })
          .then((res) => {
            this.tableData = res.data.list || []
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
        console.log(sign, row, 'sss')
        this.handlerSign = sign
        if (row) {
          this.handlerRow = deepClone(row)
        }
      },
      // 提交
      comfirmBtn() {
        this.loadingSubmit = true
        this.$refs.addCmpEl
          .validateForm()
          .then(() => {
            this.visible = false
            this.loadPage()
          })
          .finally(() => {
            this.loadingSubmit = false
          })
      },
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
          this.$api('user/updateStatus', {
            roleId: data.id,
            status: statusSubmit,
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
      // 删除
      handlerDel({ row }) {
        this.$confirm(`确认删除该项?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.loading = true
          this.$api('user/deleteRole', { id: row.id })
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
  