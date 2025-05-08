<template>
  <div v-loading="loading" class="table-container-main">
    <el-table ref="tbTable" :data="tableData" v-bind="$attrs" width="100%" stripe v-on="$listeners">
      <template v-for="(item, index) in tableTitle">
        <slot v-if="item.slot" :data="item" :name="item.slot" />
        <el-table-column v-else :key="item.key || index" :prop="item.prop" :label="item.label" :fixed="item.fixed"
          :show-overflow-tooltip="true" :min-width="item.minWidth ? item.minWidth : null"
          :width="item.width ? item.width : null" :align="item.align || defaultAlgin" :type="item.type || null"
          :sortable="item.sortable || null" :index="indexMethod" :formatter="(row, column, cellValue, index) =>
              commonFormat({ row, column, cellValue, index }, item)
            " />
      </template>
      <el-table-column :label="handlerLabel" fixed="right" :width="handlerWith" align="center" v-if="hasHandler">
        <template slot-scope="scope">
          <template v-for="(item, i) in handlerBtns">
            <slot v-if="item.slot" :row="scope.row" :scope="scope" :name="item.slot" />
            <el-button v-else-if="hasShowBtn(scope.row, item)" :key="i" type="text" size="small"
              @click="handlerEmit(scope.row, item, scope.$index)">
              {{ item.label }}
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="hasPagination" class="pagination-main">
      <el-pagination :current-page.sync="pagerConfig.currentPage" :page-sizes="pageSizes"
        :page-size="pagerConfig.pageSize" :total="pagerConfig.total" :layout="layout" v-if="pagerConfig.total != 0"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { getObjLabel } from '@/utils/tools'
export default {
  name: 'TbTable',
  props: {
    defaultAlgin: {
      default: 'center'
    },
    // 操作列名称
    handlerLabel: {
      type: String,
      default: "操作"
    },
    // 操作列宽度
    handlerWith: {
      type: [String, Number],
      default: null,
    },
    //从父级组件传递过来的选择options
    selectOptionsProp: {
      type: Object,
      default: () => {
        return {}
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
    tableData: {
      // 表格数据
      type: Array,
      default: () => [],
    },
    tableTitle: {
      // 表格头标题
      type: Array,
      default: () => [],
    },
    // 操作按钮
    handlerBtns: {
      type: Array,
      default: () => [],
    },
    // 是否需要分页
    hasPagination: {
      type: Boolean,
      default: true,
    },
    // 分页器的功能
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },
    // 页码
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100, 200, 400, 800, 1600],
    },
    hasHandler: {
      type: Boolean,
      default: true,
    },
    // 分页的参数
    pagerConfig: {
      type: Object,
      default: () => {
        return {
          currentPage: 1,
          total: 0,
          pageSize: 10,
        }
      },
    },
  },
  data() {
    return {}
  },
  methods: {
    clearSelection() {
      this.$refs.tbTable.clearSelection()
    },
    // 过滤显示数据
    commonFormat({ cellValue }, item) {
      if (item.splitSign && cellValue && Array.isArray(cellValue)) {
        return cellValue.join(item.splitSign)
      } else if (item.formatFn && typeof item.formatFn === 'function') {
        return item.formatFn(...arguments)
      } else if (item.options && item.options.length) {
        let defaultProps = item.defaultProps || {
          label: 'label',
          value: 'value',
        }
        return getObjLabel({ ...defaultProps, val: cellValue, arr: item.options })

      } else if (item.byParent) {
        let defaultProps = item.defaultProps || {
          label: 'label',
          value: 'value',
        }
        return getObjLabel({ ...defaultProps, val: cellValue, arr: this.selectOptionsProp[item.byParent], sliceNum: item.sliceNum })
      }
      if (item.empty) {
        return cellValue || item.empty
      }
      return cellValue
    },
    // 是否展示按钮-按钮权限
    hasShowBtn(row, item) {
      if (item.isShow && typeof item.isShow === 'function') {
        return item.isShow(row, item)
      }
      return true
    },
    indexMethod($index) {
      if (this.hasPagination) {
        const { currentPage, pageSize } = this.pagerConfig
        return (currentPage - 1) * pageSize + $index + 1
      } else {
        return $index + 1
      }
    },
    handleSizeChange(val) {
      this.pagerConfig.pageSize = val
      this.$emit('loadPage')
    },
    handleCurrentChange(val) {
      this.pagerConfig.currentPage = val
      this.$emit('loadPage')
    },
    // 操作按钮
    handlerEmit(row, { trigger, sign } = {}, $index) {
      if (trigger) {
        this.$emit(trigger, { row, sign, $index })
      }
    },
    getSearchParams() {
      // 返回当前组件中的查询条件
      const searchParams = {};
      this.conditions.forEach(condition => {
        if (condition.value !== undefined && condition.value !== '') {
          searchParams[condition.prop] = condition.value;
        }
      });
      return searchParams;
    }
  },
}
</script>
<style scoped lang="scss">
.table-container-main {
  padding-bottom: 20px;
  background: #fff;

  .pagination-main {
    // text-align: center;
    margin-top: 20px;
  }
}
</style>
