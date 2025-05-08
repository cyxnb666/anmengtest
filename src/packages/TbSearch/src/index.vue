<template>
    <div
      :class="{
        's-flex-query--close': hide,
        's-flex-query': true,
        'el-card': true,
        's-flex-query-no': noPadding,
      }"
      @keyup.enter="enterKeyUpSerch"
    >
      <div class="s-flex-query__body">
        <el-form
          size="small"
          label-position="left"
          @submit.native.prevent
          :label-width="labelWidth"
          ref="searchForm"
        >
          <el-row :gutter="30" type="flex" class="flex-wrap">
            <template v-if="conditions && conditions.length">
              <el-col
                v-for="(item, index) in conditions"
                :key="index"
                :span="item.span || searchSpan"
              >
                <el-form-item :label="item.label">
                  <!-- 普通输入框 -->
                  <el-input
                    v-if="item.type === 'text'"
                    v-model="item.value"
                    :clearable="item.clearable"
                    :maxlength="item.maxlength"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder || '请输入'"
                  />
                  <el-input
                    v-if="item.type === 'number'"
                    v-model="item.value"
                    type="number"
                    :maxlength="item.maxlength"
                    :disabled="item.disabled"
                    :clearable="item.clearable"
                    :placeholder="item.placeholder || '请输入'"
                  />
                  <!-- 日期 -->
                  <el-date-picker
                    v-else-if="item.type === 'date' || item.type === 'datetime'"
                    v-model="item.value"
                    :clearable="item.clearable"
                    :value-format="valueFormat(item)"
                    :editable="false"
                    style="width: 100%;"
                    :disabled="item.disabled"
                    :type="item.type"
                    :placeholder="item.placeholder"
                    :picker-options="item.picker"
                    @change="changeDate(item)"
                  />
                  <!-- 日期范围 -->
                  <el-date-picker
                    v-else-if="
                      item.type === 'datetimerange' || item.type === 'daterange'
                    "
                    v-model="item.value"
                    :disabled="item.disabled"
                    :type="item.type"
                    :clearable="item.clearable"
                    :value-format="valueFormat(item)"
                    :range-separator="item.rangeSeparator || '至'"
                    :start-placeholder="item.startPlaceholder || '开始日期'"
                    :end-placeholder="item.endPlaceholder || '结束日期'"
                  />
                  <!-- 选择器 -->
                  <el-select
                    v-else-if="item.type === 'select'"
                    v-model="item.value"
                    style="width: 100%;"
                    :clearable="item.clearable"
                    :placeholder="item.placeholder"
                    :multiple="item.multiple"
                    :filterable="item.filterable"
                    :disabled="item.disabled"
                    @change="(val) => changeSelect(val, item)"
                  >
                    <el-option
                      v-for="(option, i) in getItemOptions(item)"
                      :key="i"
                      :width="item.optionWidth || 250"
                      :label="getOptionLabel(item, option)"
                      :value="getOptionLabel(item, option, 'value')"
                      :disabled="option.disabled"
                    />
                  </el-select>
                  <search-org
                    v-if="item.type === 'org'"
                    :data.sync="item.value"
                    :disabled="item.disabled"
                    v-bind="$attrs"
                  ></search-org>
  
                  <!-- 自定义 slot-->
                  <template v-if="item.type === 'customItem'">
                    <slot :data="item" :name="item.slot || 'customItem'" />
                  </template>
                </el-form-item>
              </el-col>
            </template>
            <div class="pl15">
              <el-button
                v-if="hasSearchBtn"
                size="small"
                type="primary"
                :loading="loading"
                @click="search"
              >
                {{ searchText || '查询' }}
              </el-button>
              <el-button
                v-if="hasClearBtn"
                size="small"
                type="info"
                :loading="loading"
                @click="clear"
              >
                {{ clearText || '重置' }}
              </el-button>
  
              <!-- 自定义按钮 -->
              <slot name="customBtns" />
            </div>
          </el-row>
        </el-form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TbSearch',
    props: {
      noPadding: {
        default: false,
      },
      //从父级组件传递过来的选择options
      selectOptionsProp: {
        type: Object,
        default: () => {
          return {}
        },
      },
      // label宽度
      labelWidth: {
        type: [String, Number],
        default: null,
      },
      // 按钮loading
      loading: {
        type: Boolean,
        default: false,
      },
      // 是否使用enter快捷查询
      enterSerch: {
        type: Boolean,
        default: true,
      },
      // 输入框span
      searchSpan: {
        type: Number,
        default: 5,
      },
      // 是否需要搜索按钮
      hasSearchBtn: {
        type: Boolean,
        default: true,
      },
      // 是否需要清除按钮
      hasClearBtn: {
        type: Boolean,
        default: true,
      },
      // 搜索按钮文字
      searchText: {
        type: String,
        default: '',
      },
      // 清除按钮文字
      clearText: {
        type: String,
        default: '',
      },
      // 渲染搜索数组
      conditions: {
        required: true,
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        hide: false,
        /*
        conditions: [
          {
            prop: 'type',
            label: '选择器',
            type: 'select', // 类型,text、select、number、date、datetime、datetimerange、daterange、customItem(自定义slot)
            clearable: false, // 是否显示删除图标
            noClear: true, // 是否不能清空
            initValue: 2, // 清除时的默认值
            value: 2,
            span: 4, // 宽度el-col的span
            multiple: false, // 是否多选
            selectPropName:'',//选择器对应label
            byParent:'',//选择器options是selectOptionsProp中的属性
            defaultProp: {
              label: 'riskCnName',
              value: 'riskCode',
            },
            日期范围映射字段
            dateProp: {
              start: 'startDate',
              end: 'endDate',
            },
            选择器选项
            options: [
              { label: '第一行', value: 1 },
              { label: '第二行', value: 2 },
              { label: '第三行', value: 3 }
            ]
          },
          {
            prop: 'text',
            label: '输入框',
            value: '',
            type: 'text'
          },
          {
            prop: 'startDate',
            label: '开始日期',
            value: '',
            bigger: 'endDate', // 最大日期限制
            type: 'date'
          },
          {
            prop: 'endDate',
            label: '结束日期',
            value: '',
            smaller: 'startDate', // 最小日期限制
            type: 'date'
          },
          {
            prop: 'datetimerange',
            type: 'datetimerange',
            value: '',
            span: 7,
            label: '申请时间',
  
            dateProp:{ //时间范围分为两个字段
        start:'startTime',
        end:'endTime',
      },
          }
        ],
        slot  customBtns(自定义按钮)
        事件  clearOption(清除搜索条件) search(搜索) changeSelect(选择器change事件)
        方法  getOptionsValue(获取查询的值)  clear(清除选项)
        */
      }
    },
    mounted() {
      // 初始化日期禁用
      this.$nextTick(() => {
        if (this.conditions && this.conditions.length) {
          const list = this.conditions.filter(
            (v) => (v.type === 'date' || v.type === 'datetime') && v.value,
          )
          if (list && list.length) {
            list.forEach((item) => {
              this.changeDate(item)
            })
          }
        }
      })
    },
    methods: {
      getItemOptions(item) {
        if (item.byParent) {
          return this.selectOptionsProp[item.byParent]
        }
        return item.options
      },
      getOptionLabel(item, option, key = 'label') {
        if (item.defaultProp) {
          let optionKey = this.getSelectObj(item)[key]
          return option[optionKey]
        } else {
          return option[key]
        }
      },
      // 设置条件的值
      setConditionVal(prop, val, key = 'options') {
        for (let i = 0; i < this.conditions.length; i++) {
          const element = this.conditions[i]
          if (Array.isArray(prop)) {
            let hasItem = prop.find((v) => v.prop == element.prop)
            if (hasItem) {
              let hasKey = hasItem.key || key
              this.conditions[i][hasKey] = hasItem.val
            }
          } else if (element.prop === prop) {
            this.conditions[i][key] = val
            break
          }
        }
      },
      // enter查询
      enterKeyUpSerch() {
        if (this.enterSerch) this.search()
      },
      // 查询
      search() {
        const map = this.getOptionsValue()
        if (!this.loading) this.$emit('search', map)
      },
      valueFormat(item) {
        return item.valueFormat
          ? item.valueFormat
          : item.type === 'date' || item.type === 'daterange'
          ? 'yyyy-MM-dd'
          : 'yyyy-MM-dd HH:mm:ss'
      },
      // 获取查询的值
      getOptionsValue() {
        const map = {}
        this.conditions.forEach((item) => {
          const value = item.value || ''
          const key = item.prop
          if (Array.isArray(value)) {
            map[key] = value
            if (item.dateProp && value.length) {
              let { start = 'startTime', end = 'endTime' } = item.dateProp
              map[start] = value[0]
              map[end] = value[1]
            }
          } else if (value === null) {
            map[key] = ''
          } else if (value.toString().trim() !== '') {
            map[key] = value
            if (item.isNumber) {
              map[key] = Number(value)
            }
          }
          //获取选择器 的label
          if (item.type === 'select' && !item.multiple && item.selectPropName) {
            map[item.selectPropName] = this.getSelectName(map[key], item)
          }
        })
        return map
      },
      // 清除选项
      clear() {
        this.conditions.forEach((item) => {
          // 必填项 不清除并赋值初始值
          if (!item.noClear) {
            if (Array.isArray(item.value)) {
              item.value = []
            } else {
              item.value = ''
            }
          } else if (
            item.initValue ||
            item.initValue === 0 ||
            item.initValue === false
          ) {
            item.value = item.initValue
          }
        })
        this.$emit('clearOption')
        this.$nextTick(() => {
          this.search()
        })
      },
      getDateTime(val) {
        return new Date(val.replace(/-/g, '/')).getTime()
      },
      // 选择日期，禁用
      changeDate(item) {
        const that = this
        this.conditions.forEach((subItem) => {
          if (item.prop === subItem.smaller) {
            this.$set(subItem, 'picker', {
              disabledDate: (time) => {
                if (item.value && item.bigger) {
                  // 最长时间间隔
                  let hasIntervalDisabled = false
                  if (subItem.maxIntervalDate) {
                    hasIntervalDisabled =
                      time.getTime() >=
                      this.getDateTime(item.value) + subItem.maxIntervalDate
                  }
                  let itemValue = item.value.replace(/-/g, '/')
                  if (item.type === 'datetime') {
                    itemValue = item.value.split(' ')[0].replace(/-/g, '/')
                  }
                  return (
                    time.getTime() < new Date(itemValue).getTime() ||
                    hasIntervalDisabled
                  )
                }
                return null
              },
            })
          } else if (item.prop === subItem.bigger) {
            this.$set(subItem, 'picker', {
              disabledDate: (time) => {
                if (item.value && item.smaller) {
                  // 最长时间间隔
                  let hasIntervalDisabled = false
                  if (subItem.maxIntervalDate) {
                    hasIntervalDisabled =
                      time.getTime() <=
                      that.getDateTime(item.value) - subItem.maxIntervalDate
                  }
                  let itemValue = item.value.replace(/-/g, '/')
                  if (item.type === 'datetime') {
                    itemValue = item.value.split(' ')[0].replace(/-/g, '/')
                  }
                  return (
                    time.getTime() > new Date(itemValue).getTime() ||
                    hasIntervalDisabled
                  )
                }
                return null
              },
            })
          }
        })
      },
      // 获取选择器的label,value映射
      getSelectObj(item) {
        let label = 'label'
        let value = 'value'
        if (item.defaultProp) {
          label = item.defaultProp[label]
          value = item.defaultProp[value]
        }
        return {
          label,
          value,
        }
      },
      //获取选择的label
      getSelectName(val, item) {
        let result = val
        let options = this.getItemOptions(item)
        let { label, value } = this.getSelectObj(item)
        let hasItem = options.find((v) => v[value] === val)
        if (hasItem) {
          result = hasItem[label]
        }
        return result
      },
      // 选择器
      changeSelect(val, item) {
        const map = this.getOptionsValue()
  
        this.$emit('changeSelect', { value: val, item, map })
      },
    },
  }
  </script>
  
  <style scoped lang="scss">
  // 查询
  .s-flex-query {
    margin-bottom: 14px;
    border-bottom: rgb(232, 225, 225) 1px solid;
    border: 0;
    padding: 0 20px;
  
    &__body {
      max-height: 1000px;
      padding: 20px 0;
      overflow: hidden;
      -webkit-transition: 0.15s;
      transition: 0.15s;
    }
    &__footer {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 14px;
      background: #f2f6fc;
      border-radius: 0 0 4px 4px;
      color: #387ff4;
      cursor: pointer;
      i {
        font-size: 16px;
      }
    }
    &--close &__body {
      max-height: 0;
      padding: 0;
      opacity: 0;
    }
    &--close &__footer {
      i {
        &::before {
          content: '\e790';
        }
      }
    }
    ::v-deep {
      .el-form-item__content {
        display: flex;
      }
      // 表单样式修改
      .el-select,
      .el-date-editor.el-input,
      .el-date-editor.el-input__inner,
      .el-input-number,
      .el-input,
      .el-cascader {
        width: 100%;
      }
      .el-cascader {
        width: 450px;
      }
      .flex-wrap {
        flex-wrap: wrap;
      }
      .el-range-separator {
        box-sizing: content-box;
      }
      .pl15 {
        padding-left: 15px;
      }
    }
    ::v-deep {
      .el-col-5,
      .el-col-6,
      .el-col-7,
      .el-col-8,
      .el-col-9,
      .el-col-10,
      .el-col-11,
      .el-col-12,
      .el-col-13 {
        width: auto;
      }
      .el-form-item {
        margin-bottom: 15px;
      }
      .search-input {
        width: 200px;
      }
    }
  }
  .s-flex-query-no {
    padding: 0;
    .s-flex-query__body {
      padding: 0 !important;
    }
  }
  </style>
  