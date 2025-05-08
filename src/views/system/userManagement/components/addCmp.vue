<template>
    <t-dialog
      v-bind="$attrs"
      v-on="$listeners"
      v-model="dialogVisible"
      title="分配角色"
      :disabled="disabled"
      append-to-body
      @comfirmBtn="submit"
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
          <template slot="handler" slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              @click="handlerControl(row)"
            >
            添加
            </el-button>
          </template>
        </tb-table>
      </div>
    </t-dialog>
  </template>
  <script>
  import { validUsername, isPhone } from '@/utils/validate'
  import { defaultPwd } from '@/settings'
  
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
            label: '角色编码',
            prop: 'userName',
          },
          {
            prop: 'roleCode',
            label: '角色名称',
          },
          {
            prop: 'roleCode',
            label: '角色编码',
          },
        ],
        handlerBtns: [
          {
            label: '重置密码',
            slot: 'handler',
          },
        ],
        formData: {
          startStatus: '1',
          stopStatus: '1',
          startDate: '',
          stopDate: '',
          roles: [],
        },
        conditions: [
          {
            prop: 'userName',
            type: 'text',
            label: '角色名称',
            clearable: true,
            value: '',
          },
        ],
      }
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
          if (this.handlerSign === 'change' && val) {
            this.formData = { ...this.formData, ...val }
          }
        },
        deep: true,
        immediate: true,
      },
    },
    methods: {
       search(map) {
        this.map = map
        this.pagerConfig.currentPage = 1
        this.loadPage()
      },
      handlerControl(){
  
      },
      loadPage() {
        this.loading = true
        const config = {
          ...this.map,
          currentPage: this.pagerConfig.currentPage,
          pageSize: this.pagerConfig.pageSize,
        }
        queryLearningSituationListCount(config).then((res) => {
          let list = res.data || []
          let studyCompleteNum = 0
          let studyInlearningNum = 0
          if (list.length) {
            let hasItem = list[0]
            if (hasItem) {
              studyCompleteNum = hasItem.studyCompleteNum || 0
              studyInlearningNum = hasItem.studyInlearningNum || 0
            }
          }
          this.formData.studyCompleteNum = studyCompleteNum
          this.formData.studyInlearningNum = studyInlearningNum
        })
        queryLearningSituationList(config)
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
      // 提交
      submit() {
        return new Promise((resolve, reject) => {
          this.$refs.form.validate((valid) => {
            if (valid) {
              this.loading = true
              saveEvent({ ...this.form, ...this.currentUserInfo })
                .then((res) => {
                  if (res.code === 200) {
                    this.$message({
                      showClose: true,
                      message: '操作成功',
                      type: 'success',
                    })
                    this.$emit('change', false)
                    this.$emit('getList')
                  }
                })
                .finally(() => {
                  this.loading = false
                })
            }
          })
        })
      },
    },
  }
  </script>
  <style scoped lang="scss">
  </style>
  