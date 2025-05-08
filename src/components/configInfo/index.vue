<template>
    <div class="config-rule-main-style">
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-plus"
        class="mb20"
        :disabled="disabled"
        v-if="!isOnlyRule"
        @click="handlerAddRule"
      >
        新增条件
      </el-button>
      <div
        :class="['config-rule-items', isOnlyRule ? 'config-rule-items-only' : '']"
        v-show="configRule && configRule.length"
      >
        <div
          :class="['config-rule-items-inner']"
          v-for="(item, i) in configRule"
          :key="i"
        >
          <div
            class="config-rule-items-header-inner"
            @click.prevent="handlerCollSpan(i)"
            v-if="!isOnlyRule"
          >
            <i
              :class="[
                item.show ? 'el-icon-arrow-down' : 'el-icon-arrow-right',
                'icon-arrow-header',
              ]"
            ></i>
            <div class="flex-v config-rule-items-header-innercontent">
              <div class="rule-name-box" @click.stop>
                <!-- 条件名称 -->
                <div class="rule-name-title flex-v">
                  <div v-show="!item.showEditName" class="flex-v">
                    {{ item.name }}
                    <i
                      v-if="!disabled"
                      class="el-icon-edit-outline icon-edit"
                      @click="handlerControlEdit(i, 'showEditName')"
                    ></i>
                  </div>
                  <div v-show="item.showEditName" class="flex-v">
                    <el-input
                      size="mini"
                      placeholder="请输入"
                      v-model="item.name"
                      clearable
                      class="input-name"
                    ></el-input>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handlerControlEdit(i, 'showEditName')"
                    >
                      确定
                    </el-button>
                  </div>
                  <!-- 活动类型 -->
                  <!-- <div class="flex-v rule-name-type">
                    <div class="rule-name-type-label">
                      规则类型：
                    </div>
                    <el-select
                      v-model="item.type"
                      size='mini'
                      :disabled="disabled"
                      @change="(e)=>handlerChangeType(e,{item,i})"
                      placeholder="请选择规则类型"
                    >
                      <el-option
                        v-for="(it) in configRuleOptions"
                        filterable
                        :key="it.value"
                        :value="it.value"
                        :label="it.label"
                      ></el-option>
                    </el-select>
                  </div> -->
                </div>
                <div class="rule-name-remark">
                  <div v-show="!item.showEditRemark" class="flex-v">
                    <span class="remark">{{ item.desc || '请输入备注' }}</span>
                    <i
                      v-if="!disabled"
                      class="el-icon-edit-outline icon-edit"
                      @click="handlerControlEdit(i, 'showEditRemark')"
                    ></i>
                  </div>
                  <div v-show="item.showEditRemark" class="flex-v">
                    <el-input
                      placeholder="请输入备注"
                      size="mini"
                      clearable
                      class="input-name"
                      v-model="item.desc"
                    ></el-input>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handlerControlEdit(i, 'showEditRemark')"
                    >
                      确定
                    </el-button>
                  </div>
                </div>
              </div>
              <div class="flex-v" @click.stop>
                <!-- 删除 -->
                <div
                  class="delete-items-btn"
                  @click="handlerDelRule(i)"
                  v-if="!disabled && !isOnlyRule"
                >
                  <i class="el-icon-delete"></i>
                </div>
              </div>
            </div>
          </div>
          <el-collapse-transition>
            <div class="rule-box" v-show="item.show">
              <Rule
                :configData="item.configData"
                :configType="item.type"
                v-bind="$attrs"
                ref="ruleEl"
                :disabled="disabled"
                :rule-name="item.name"
              ><slot></slot></Rule>
            </div>
          </el-collapse-transition>
        </div>
      </div>
    </div>
  </template>
  <script>
  import Rule from './components/rule.vue'
  import { deepClone } from '@/utils'
  import { scrollTo } from '@/utils/scroll-to'
  export default {
    name: 'CustomForm',
    componentName: 'CustomForm',
    components: {
      Rule,
    },
    props: {
      configRule: {
        type: Array,
        default: () => [],
      },
      disabled: {},
      //是否只一条数据
      isOnlyRule: {
        default: true,
      },
    },
    data() {
      return {
        fields: [], //if组件的实例
        baseInfo: {},
        initRule: {
          name: '条件名称',
          desc: '',
          type: 3,
          showEditName: false,
          showEditRemark: false,
          show: true,
          configData: {
            if: {
              pos: [0, 0],
              refType: 'and',
              conditions: [],
            },
            then: {
              actions: [
                {
                  value: {
                    type: 'integral',
                    content: '',
                  },
                },
              ],
            },
            elseIf: [],
            /* else: {
              actions: [],
            }, */
          },
        },
      }
    },
    watch: {
      configRule: {
        handler(val) {
          if ((!val || !val.length) && this.isOnlyRule) {
            this.$emit('update:configRule', [deepClone(this.initRule)])
          }
        },
        immediate: true,
        deep: true,
      },
    },
    //接收item
    created() {
      this.$on('custom.form.addField', (field) => {
        if (field) {
          this.fields.push(field)
        }
      })
      /* istanbul ignore next */
      this.$on('custom.form.removeField', (field) => {
        if (field.prop) {
          this.fields.splice(this.fields.indexOf(field), 1)
        }
      })
    },
    mounted() {
    },
    beforeDestroy() {
    },
    methods: {
      handlerChangeType(e, { i }) {
        this.$bus.$emit('changeConfigRule', { index: i })
      },
      //设置值
      setContentVal() {
        if (this.fields && this.fields.length) {
          this.fields.forEach((it) => {
            it.setContentVal && it.setContentVal()
          })
        }
      },
      //校验 sign=true为提交,单规则
      validateForm(sign = false) {
        let configRule = deepClone(this.configRule)
        if (this.isOnlyRule) {
          configRule = this.configRule[0].configData
        }
        return new Promise((resolve, reject) => {
          if (sign) {
            // 校验是否填写条件
            let error = []
            let ifData = configRule.if
            let elseData = configRule.elseIf
            if (!ifData?.conditions?.length) {
              error.push({ msg: 'if尚未添加条件，请检查！',sign:'if' })
            }
            if (elseData?.length) {
              let elseError = []
              elseData.forEach((v, index) => {
                if (!v?.if?.conditions?.length) {
                  elseError.push({ ...v, index })
                }
              })
              if (elseError.length) {
                let firstElse = elseError[0]
                error.push({ msg: 'elseIf尚未添加条件，请检查！',sign:"elseIf",index:firstElse.index })
              }
            }
            if (error.length) {
              let { msg,sign,index } = error[0]
              this.$refs.ruleEl[0].scrollToCon(sign,index)
              this.$message.error(`${msg}`)
              return reject()
            }
            //校验具体条件
            const result = []
            if (this.fields && this.fields.length) {
              this.fields.forEach((it) => {
                result.push(it.validateForm())
              })
            }
            console.log(configRule, 'configRuleconfigRule')
            Promise.all(result)
              .then(() => {
                resolve(configRule)
              })
              .catch((err) => {
                this.$message.error(`条件尚未填写完成，请检查！`)
                reject()
              })
          } else {
            resolve(configRule)
          }
        })
      },
      clearShowEdit() {
        this.configRule.forEach((it) => {
          it.showEditName = false
          it.showEditRemark = false
        })
      },
      handlerControlEdit(i, sign) {
        this.configRule[i][sign] = !this.configRule[i][sign]
      },
      //删除规则
      handlerDelRule(i) {
        let msg = `是否确定删除该条件？`
        this.$confirm(`${msg}`, '提示').then(() => {
          this.configRule.splice(i, 1)
          this.$bus.$emit('changeConfigRule', { index: i })
        })
      },
      handlerCollSpan(i) {
        this.configRule[i].show = !this.configRule[i].show
        this.clearShowEdit()
      },
      handlerAddRule() {
        let data = deepClone(this.initRule)
        data.name = `条件名称${this.configRule.length + 1}`
        this.configRule.push(data)
      },
    },
  }
  </script>
  <style scoped lang="scss">
  .config-rule-main-style {
    .mb20 {
      margin-bottom: 15px;
    }
    .config-rule-items {
      background-color: #fafafa;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      border-bottom: 0;
      .rule-name-title {
        margin-bottom: 10px;
      }
      .config-rule-items-inner {
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        .config-rule-items-header-inner {
          padding: 12px 16px 12px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          border-bottom: 1px solid #d9d9d9;
  
          .icon-arrow-header {
            color: inherit;
            font-style: normal;
            line-height: 0;
            text-align: center;
            text-transform: none;
            vertical-align: -0.125em;
            text-rendering: optimizeLegibility;
            position: absolute;
            top: 50%;
            left: 16px;
            display: inline-block;
            font-size: 12px;
            transform: translateY(-50%);
            font-size: 14px;
          }
        }
      }
      .config-rule-items-header-innercontent {
        width: 100%;
        justify-content: space-between;
      }
      .delete-items-btn {
        margin-right: 5px;
        border: 1px solid #3f70eb;
        border-radius: 10px;
        text-align: center;
        width: 34px;
        height: 22px;
        line-height: 18px;
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        &:active {
          background: rgb(247, 243, 243);
        }
        & > i {
          color: #3f70eb;
        }
      }
      .rule-box {
        padding: 16px;
        border-bottom: 1px solid #d9d9d9;
        border-end-end-radius: 4px;
        border-start-end-radius: 4px;
      }
      .rule-name-remark {
        .remark {
          font-size: 12px;
          color: #999;
        }
      }
      .rule-name-box {
        .icon-edit {
          font-size: 16px;
          color: #4072ee;
          cursor: pointer;
          margin-left: 10px;
        }
        .rule-name-type {
          margin-left: 30px;
        }
      }
      .input-name {
        width: 250px;
        margin-right: 5px;
      }
    }
    .config-rule-items-only {
      border: 0;
      .rule-box {
        padding: 0 !important;
        border-bottom: 0 !important;
      }
    }
  }
  </style>
  