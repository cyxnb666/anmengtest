<template>
    <div>
      <tb-search
        ref="tbSearch"
        :conditions="conditions"
        :loading="loading"
        :flatDistrictOptions="flatDistrictOptions"
        :districtFirstOptions="districtFirstOptions"
        @search="search"
      ></tb-search>
      <tb-table
        ref="tbTable"
        :loading="loading"
        :pager-config="pagerConfig"
        :handler-btns="handlerBtns"
        :table-title="tableTitle"
        :table-data="tableData"
        handler-with="200"
        @handlerChange="handlerChange"
        @loadPage="loadPage"
        @handlerRestPwd="handlerRestPwd"
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
              statusKey="userStatus"
              @getList="loadPage"
              :loading.sync="loading"
              :keys="['userCode']"
              url="user/updateUserStatus"
            ></switch-btn>
          </template>
        </el-table-column>
        <!-- <template slot="handlerStatus" slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            @click="handlerStatus(row, 'userStatus')"
          >
            {{ row.userStatus !== '1' ? '启用' : '禁用' }}
          </el-button>
        </template> -->
      </tb-table>
      <component
        :is="handlerSign"
        @getList="loadPage"
        v-if="visible"
        v-model="visible"
        :handlerSign="handlerSign"
        :handlerRow="handlerRow"
      ></component>
    </div>
  </template>
  <script>
  import { setChilrenToNull, flatTree } from '@/utils/tree'
  
  import conditions from './searchbar'
  import tableTitle, { handlerBtns } from './table'
  import AddCmp from './components/addCmp.vue'
  import { defaultPwd } from '@/settings'
  import { findValue, getCurrentPage,deepClone } from '@/utils/tools'
  export default {
    components: {
      add: AddCmp,
      change: AddCmp,
      addUserRole: () => import('./components/addUserRole.vue'),
    },
    data() {
      return {
        districtFirstOptions: [],
        flatDistrictOptions: [],
        roleList: [], // 角色列表
        postList: [], // 岗位列表
        orgList: [], // 机构列表
        loading: false,
        loadingSubmit: false,
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
      organizationName({ orgList }) {
        return function (id) {
          return findValue({ arr: orgList, val: id })
        }
      },
      // 是否能够修改
      isDisabled({ handlerSign, hasPerm }) {
        return handlerSign === 'change' && !hasPerm('changeUser')
      },
    },
    mounted() {
      this.queryDistrict()
      this.loadPage()
    },
    methods: {
      //获取机构
      queryDistrict() {
        this.$api('common/queryDistrict').then((res) => {
          console.log(res.data, 'data')
          let data = res.data || {}
          let list = setChilrenToNull([data])
          let flatTreeData = flatTree(list)
          this.flatDistrictOptions = flatTreeData
          this.districtFirstOptions = list
        })
      },
      loadPage() {
        this.loading = true
        const { pageSize, currentPage } = this.pagerConfig
        this.$api('user/getUserList', {
          pageSize,
          currentPage,
          ...this.map,
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
        this.handlerSign = sign
        if (row) {
          this.handlerRow = { ...row }
        }
      },
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
          this.$api('user/updateUserStatus', {
            userCode: data.userCode,
            userStatus: statusSubmit,
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
      // 重置密码
      handlerRestPwd(data) {
        this.$confirm(`确认重置密码?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.loading = true
          this.$api('user/resetPassword', { userCode: data.userCode })
            .then(() => {
              this.$alert(`初始密码是：${defaultPwd}`, '重置成功', {
                confirmButtonText: '确定',
                callback: () => {
                  this.loadPage()
                },
              })
            })
            .finally(() => {
              this.loading = false
            })
        })
      },
      // 删除用户
      handlerDel({ row }) {
        this.$confirm(`确认删除该用户?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.loading = true
          delUser({ id: row.id })
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
  