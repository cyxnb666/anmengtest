<template>
    <div class="rule-select-org-main">
      <ul class="el-menu-vertical-demo el-menu">
        <li
          :class="['el-submenu', activeItem === item.value ? 'is-opened' : '']"
          v-for="(item, index) in ruleNodeOptions"
          :key="index"
          @click="handlerSubmenu(item, index)"
        >
          <div class="el-submenu__title">
            <span>{{ item.label }}</span>
            <i
              class="el-submenu__icon-arrow el-icon-arrow-down arrow-icon"
              v-show="item.value != 'all'"
            ></i>
          </div>
          <div
            v-if="activeItem === item.value && item.value != 'all'"
            class="tree-box"
          >
            <el-tree
              id="tree-option"
              ref="tree"
              class="tree-box"
              :props="props"
              :node-key="props.value"
              accordion
              highlight-current
              show-checkbox
              :default-expanded-keys="defaultExpendedKeys"
              :default-checked-keys="defaultCheckedKeys"
              :data="districtFirstOptions"
              :expand-on-click-node="false"
              :check-strictly="true"
              @node-expand="nodeExpand"
              @node-collapse="nodeClose"
              @check="handlerNodeCheck"
              v-bind="$attrs"
              v-on="$listeners"
            ></el-tree>
          </div>
        </li>
      </ul>
    </div>
  </template>
  <script>
  import { getChildrenIds } from '@/utils/tree'
  import { debounce } from '@/utils/tools'
  import { ruleNodeOptions } from '@/config/options'
  export default {
    props: {
      flatDistrictOptions: {},
      districtFirstOptions: {},
    },
    data() {
      return {
        /* 配置项 */
        props: {
          value: 'comCode', // ID字段名
          label: 'comName', // 显示名称
          children: 'children', // 子级字段名
        },
        defaultExpendedKeys: [],
        defaultCheckedKeys: [],
        ruleNodeOptions: [
          {
            label: '全部',
            value: 'all',
          },
          ...ruleNodeOptions,
        ],
        activeIndex: 0,
        activeItem: 'all',
      }
    },
    created() {},
    methods: {
      handlerSearch: debounce(function () {
        let arr = this.getTreeEl().getCheckedKeys()
        console.log(arr, '搜索')
      }, 500),
      handlerNodeCheck(data, { checkedKeys }) {
        let checked = checkedKeys.includes(data.comCode)
        let arr = getChildrenIds(data.comCode, this.flatDistrictOptions)
        this.setTreeChecked(arr, checked)
      },
      setTreeChecked(arr, checked) {
        arr.forEach((v) => {
          this.getTreeEl().setChecked(v, checked)
        })
        this.$nextTick(() => {
          this.handlerSearch()
        })
      },
      //获取树的节点
      getTreeEl() {
        let el = this.$refs.tree
        if (Array.isArray(el) && el.length) {
          el = el[0]
        }
        return el
      },
      // 节点展开操作
      nodeExpand(data) {
        this.defaultExpendedKeys.push(data.id)
      },
      nodeClose(data) {
        this.defaultExpendedKeys = this.defaultExpendedKeys.filter(
          (item) => item !== data.id,
        )
      },
  
      handlerSubmenu({ value }, activeIndex) {
        this.defaultExpendedKeys = []
        this.defaultCheckedKeys = []
        this.activeIndex = activeIndex
        if (value !== this.activeItem) {
          this.activeItem = value
        } else {
          this.activeItem = ''
        }
      },
    },
  }
  </script>
  <style scoped lang="scss">
  .rule-select-org-main {
    background: #fff;
    width: 300px;
    padding: 15px;
    min-height: 100%;
    .tree-box {
      max-height: 300px;
      overflow-y: auto;
    }
    ul,
    li {
      list-style: none;
    }
    .arrow-icon {
      display: block !important;
    }
    .is-opened {
      background-color: #ecf5ff;
    }
    ::v-deep {
      .el-menu {
        border: 0;
      }
    }
  }
  </style>
  