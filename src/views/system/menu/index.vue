<template>
    <el-card>
      <div class="per-management-main">
        <div class="inner-top">
          <div class="inner-input">
            <el-input
              v-model.trim="filterText"
              clearable
              size="small"
              placeholder="请输入关键字过滤"
            />
          </div>
          <el-button
            type="primary"
            size="mini"
            class="add-btn"
            :loading="loading"
            @click="handlerNode('add')"
          >
            新增
          </el-button>
        </div>
        <el-tree
          ref="tree"
          :data="dataList"
          :props="defaultProps"
          node-key="id"
          :filter-node-method="filterNode"
          :default-expanded-keys="defaultExpendedKeys"
          @node-expand="nodeExpand"
          @node-collapse="nodeClose"
        >
          <template #default="{ node, data }">
            <div class="custom-tree-node">
              <span class="txt_title">
                <i v-show="data.pageType==='fun'" class="el-icon-thumb icon-thumb" />
                {{ node.label }}
              </span>
              <span>
                <el-button
                  type="success"
                  size="mini"
                  :loading="loading"
                  @click="handlerChange('change', data)"
                >
                  更改
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  :loading="loading"
                  @click="handlerNode('add', data)"
                >
                  添加
                </el-button>
                <el-button
                  type="danger"
                  size="mini"
                  :loading="loading"
                  :disabled="data.children && data.children.length ? true : false"
                  @click="delNode(data)"
                >
                  删除
                </el-button>
              </span>
            </div>
          </template>
        </el-tree>
        <!-- 操作表单 -->
        <t-dialog
          v-if="centerDialogVisible"
          v-model="centerDialogVisible"
          :title="handlerTitle"
          width="40%"
          :closeOnClickModal="true"
          :disabled="handlerSign === 'view'"
          :loading="loadingSubmit"
          @comfirmBtn="comfirmBtn"
        >
          <addCmp
            ref="addCmpEl"
            :handler-row="handlerRow"
            :handler-sign="handlerSign"
          />
        </t-dialog>
      </div>
    </el-card>
  </template>
  <script>
  import addCmp from './addCmp'
  import { setChilrenToNull } from '@/utils/tools'
  export default {
    components: {
      addCmp,
    },
    data() {
      return {
        loadingSubmit: false,
        loading: false,
        filterText: '',
        dataList: [], // 数据
        handlerRow: {},
        handlerSign: 'add',
        centerDialogVisible: false,
        defaultProps: {
          children: 'children',
          label: 'title',
        },
        defaultExpendedKeys: [],
      }
    },
    computed: {
      handlerTitle({ handlerSign }) {
        return handlerSign === 'change'
          ? '修改权限'
          : handlerSign === 'view'
          ? '查看权限'
          : '添加权限'
      },
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      },
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 节点展开操作
      nodeExpand(data) {
        this.defaultExpendedKeys.push(data.id)
      },
      nodeClose(data) {
        this.defaultExpendedKeys = this.defaultExpendedKeys.filter(
          (item) => item !== data.id,
        )
      },
      getList() {
        this.$api('user/allMenu').then((res) => {
          let list = res.data || []
          this.dataList = setChilrenToNull(list)
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.title.indexOf(value) !== -1
      },
      // 查询节点
      findNode(tree, func) {
        let node
        const list = [...tree]
        while ((node = list.shift())) {
          if (func(node)) {
            return node
          }
          node.children && list.unshift(...node.children)
        }
      },
      // 修改
      handlerChange(sign, row) {
        this.handlerSign = sign
        if (row) {
          const result = this.findNode(this.dataList, (node) => {
            return node.id === row.pid
          })
          this.handlerRow = { ...row, parentName: result?.title,parentId:row.pid }
        }
        this.centerDialogVisible = true
      },
      //新增
      handlerNode(sign, row) {
        this.handlerSign = sign
        if (row) {
          this.handlerRow = {
            ...row,
            parentName: row?.title || '',
            parentId: row.id,
          }
        } else {
          this.handlerRow = { parentId: 0 }
        }
        this.centerDialogVisible = true
      },
      delNode(data) {
        this.$confirm(`确认删除该节点?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.loading = true
            this.$api('user/deleteMenu', { menuId: data.id })
              .then(() => {
                this.$message.success('删除成功')
                this.getList()
              })
              .finally(() => {
                this.loading = false
              })
          })
          .catch(() => {})
      },
      // 添加/修改权限
      comfirmBtn() {
        this.loadingSubmit = true
        this.$refs.addCmpEl
          .validateForm()
          .then(() => {
            this.centerDialogVisible = false
            this.getList()
          })
          .finally(() => {
            this.loadingSubmit = false
          })
      },
    },
  }
  </script>
  <style scoped lang="scss">
  .per-management-main {
    padding: 30px;
    .inner-top {
      display: flex;
      margin-bottom: 20px;
      .add-btn {
        margin-left: 20px;
      }
      .inner-input {
        width: 300px;
      }
    }
    .icon-thumb {
      margin-right: 5px;
    }
    ::v-deep .el-tree-node {
      margin: 10px 0;
      .custom-tree-node {
        flex: 1;
        width: 700px;
      }
      .txt_title {
        width: 320px;
        display: inline-block;
      }
    }
  }
  </style>
  