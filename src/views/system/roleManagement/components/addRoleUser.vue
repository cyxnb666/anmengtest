<template>
    <t-dialog
      v-bind="$attrs"
      v-on="$listeners"
      v-model="dialogVisible"
      :title="title"
      :disabled="disabled"
      append-to-body
      :footerSlot="true"
      :closeOnClickModal="true"
      width="900px"
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
          border
          :table-data="tableData"
           @loadPage="loadPage"
        >
          <el-table-column
            align="center"
            slot="status"
            :label="data.label"
            slot-scope="{ data }"
          >
            <template slot-scope="{ row }">
              {{ !isAdd(row)?'已添加':'未添加' }}
            </template>
          </el-table-column>
          <template slot="handler" slot-scope="{ row }">
            <el-button type="text" size="small" @click="handlerControl(row)">
              {{ isAdd(row) ? '添加' : '移除' }}
            </el-button>
          </template>
        </tb-table>
      </div>
    </t-dialog>
  </template>
  <script>
  export default {
    props: {
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
    },
    model: {
      prop: 'visible',
      event: 'change',
    },
    data() {
      return {
        dialogVisible: false,
        tableData: [],
        roles: [], //当前用户绑定角色
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
            label: '工号',
            width: '120',
            prop: 'userCode',
          },
          {
            prop: 'username',
            label: '姓名',
          },
          {
            slot: 'status',
            label: '状态',
          },
        ],
        handlerBtns: [
          {
            label: '操作',
            slot: 'handler',
          },
        ],
        conditions: [
          {
            prop: 'message',
            type: 'text',
            label: '姓名/工号：',
            placeholder:"请输入姓名/工号搜索",
            clearable: true,
            value: '',
          },
          {
            prop: 'status',
            type: 'select',
            label: '状态：',
            clearable: true,
            options: [
              {
                label: '已添加',
                value: '1',
              },
              {
                label: '未添加',
                value: '0',
              },
            ],
            value: '',
          },
        ],
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getCurrentRoles()
        this.loadPage()
      })
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
        handler(val) {},
        deep: true,
        immediate: true,
      },
    },
    computed: {
      title({ handlerRow }) {
        let name = handlerRow.username
        if (name) {
          return `为【${name}】分配角色`
        }
        return '分配角色'
      },
    },
    methods: {
      isAdd(row) {
        return !this.roles.some((v) => v == row.userCode)
      },
      getCurrentRoles() {
        this.$api('user/selectUserByRole', {
          roleId: this.handlerRow.id,
        }).then((res) => {
          let list=res.data || []
          this.roles = list.map(v=>v.userCode)
        })
      },
      search(map) {
        this.map = map
        this.pagerConfig.currentPage = 1
        this.loadPage()
      },
      handlerControl(row) {
        let isAdd = this.isAdd(row)
        let msg = isAdd ? '添加' : '移除'
        this.$confirm(`是否${msg}该用户?`, `提示`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.loading = true
          let {  id } = this.handlerRow
          this.$api('user/addUser', {
            roleId:id,
            userCode:row.userCode,
            status: isAdd ? '1' : '0',
          })
            .then(() => {
              this.$message.success('操作成功')
              this.getCurrentRoles()
              this.loadPage()
            })
            .finally(() => {
              this.loading = false
            })
        })
      },
      loadPage() {
        this.loading = true
        const config = {
          ...this.map,
          roleId: this.handlerRow.id,
          currentPage: this.pagerConfig.currentPage,
          pageSize: this.pagerConfig.pageSize,
        }
        this.$api('user/selectUser', config)
          .then((res) => {
            if (res.code === 200) {
              let list = res.data.list || []
              this.tableData = list
              this.pagerConfig.total = res.data.total || 0
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
  