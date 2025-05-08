<template>
    <t-dialog
      v-bind="$attrs"
      v-on="$listeners"
      v-model="dialogVisible"
      :title="title"
      width="700px"
      append-to-body
      :loading="loading"
      @comfirmBtn="submit"
    >
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
  
      <div class="menu-box" v-loading="loading">
        <el-tree
          class="filter-tree"
          :data="allMenuList"
          node-key="id"
          show-checkbox
          :props="defaultProps"
          default-expand-all
          :check-strictly="true"
          @check="handlerNodeCheck"
          :filter-node-method="filterNode"
          ref="tree"
        ></el-tree>
      </div>
    </t-dialog>
  </template>
  <script>
  import { statusOptions } from '@/config/options'
  import { jsonToStr } from '@/utils/tools'
  import { getChildrenIds } from '@/utils/tree'
  
  export default {
    props: {
      allMenuList: {},
      flatOptions:{},
      methodOptions: {},
      visible: {},
      handlerRow: {
        type: Object,
        default: () => {},
      },
      handlerSign: {
        type: String,
        default: '',
      },
    },
    model: {
      prop: 'visible',
      event: 'change',
    },
    data() {
      return {
        dataMenu: [],
        filterText: '',
        loading: false,
        dialogVisible: false,
        statusOptions,
        defaultProps: {
          label: 'title',
        },
        formData: {
          validStatus: '1',
        },
        rules: {
          roleCode: [
            {
              required: true,
              message: '请输入角色编码',
              trigger: 'blur',
            },
            {
              pattern: /^[\da-zA-Z\_\-]{1,50}$/,
              message: '代码可输入字母、数字，中划线，下划线等',
              trigger: 'blur',
            },
          ],
          roleName: [
            {
              required: true,
              message: '请输入角色名称',
              trigger: 'blur',
            },
          ],
          validStatus: [
            {
              required: true,
              message: '请选择状态',
              trigger: 'change',
            },
          ],
        },
        defaultCheckedKeys: [],
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getMyMenu()
      })
    },
    computed: {
      title({ handlerSign }) {
        return `菜单权限`
      },
      isAdd({ handlerSign }) {
        return handlerSign === 'add'
      },
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      },
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
          if (this.handlerSign !== 'add' && val) {
            this.formData = { ...val }
          }
        },
        immediate: true,
        deep: true,
      },
    },
    methods: {
      getMyMenu() {
        this.loading = true
        this.$api('user/selectMenuByRole', { roleId: this.handlerRow.id })
          .then((res) => {
            let list = res.data || []
            this.dataMenu = list.map((it) => it.id)
            this.$refs.tree.setCheckedKeys(this.dataMenu)
          })
          .finally(() => {
            this.loading = false
          })
      },
      //选择
      handlerNodeCheck(data, { checkedKeys } = {}) {
        let checked = checkedKeys.includes(data.id)
        let arr = getChildrenIds(data.id, this.flatOptions,{value:'id'})
        this.setTreeChecked(arr, checked)
      },
      setTreeChecked(arr, checked) {
        arr.forEach((v) => {
          this.$refs.tree.setChecked(v, checked)
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      // 提交
      submit() {
        let arr = this.$refs.tree.getCheckedKeys()
        console.log(arr, 'arr')
        let url = 'user/bandMenu'
        this.loading = true
        this.$api(url, { menuIdList: arr, roleId: this.handlerRow.id })
          .then((res) => {
            this.$message.success('操作成功')
            this.$emit('change', false)
            this.$emit('getList')
          })
          .finally(() => {
            this.loading = false
          })
      },
    },
  }
  </script>
  <style scoped lang="scss">
  .menu-box {
    margin-top: 10px;
    max-height: 350px;
    overflow: auto;
  }
  </style>
  