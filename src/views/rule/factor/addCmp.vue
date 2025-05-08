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
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        v-bind="$attrs"
        class="common-form-main"
        label-width="120px"
      >
        <el-form-item label="因子分类：" prop="divisorType">
          <el-select v-model="formData.divisorType" placeholder="请选择因子分类">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in factorClassifyOptions"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
  
        <el-form-item label="因子名称：" prop="divisorName">
          <el-input
            v-model="formData.divisorName"
            clearable
            :maxlength="30"
            placeholder="请输入因子名称"
          />
        </el-form-item>
        <el-form-item label="因子代码：" prop="divisorCode">
          <el-input
            v-model="formData.divisorCode"
            clearable
            :maxlength="100"
            :disabled="!isDev&&!isAdd"
            placeholder="请输入因子代码"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="divisorStatus">
          <el-radio-group v-model="formData.divisorStatus">
            <el-radio
              :label="item.value"
              v-for="item in statusOptions"
              :key="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="formData.remark"
            clearable
            :maxlength="900"
            :autosize="{ minRows: 2, maxRows: 6 }"
            type="textarea"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
    </t-dialog>
  </template>
  <script>
  import {
    factorTypeOptions,
    factorClassifyOptions,
    statusOptions,
    judgeOptions,
  } from '@/config/options'
  export default {
    props: {
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
        loading: false,
        dialogVisible: false,
        factorTypeOptions,
        factorClassifyOptions,
        judgeOptions,
        statusOptions,
        formData: {
          divisorType: 'veric',
          divisorBlockOrNot: '1',
          divisorStatus: '1',
        },
        rules: {
          divisorCode: [
            {
              required: true,
              message: '因子代码不能为空',
              trigger: 'blur',
            },
            {
              pattern: /^[\da-zA-Z\_\-]{1,50}$/,
              message: '代码可输入字母、数字，中划线，下划线等',
              trigger: 'blur',
            },
          ],
          divisorName: [
            {
              required: true,
              message: '因子名称不能为空',
              trigger: 'blur',
            },
          ],
          divisorStatus: [
            {
              required: true,
              message: '状态不能为空',
              trigger: 'blur',
            },
          ],
          divisorStatus: [
            {
              required: true,
              message: '状态不能为空',
              trigger: 'blur',
            },
          ],
          divisorBlockOrNot: [
            {
              required: true,
              message: '是否阻碍流程不能为空',
              trigger: 'blur',
            },
          ],
          divisorType: {
            required: true,
            message: '因子分类不能为空',
            trigger: 'blur',
          },
        },
        defaultCheckedKeys: [],
      }
    },
    computed: {
      title({ handlerSign }) {
        let msg = '因子'
        let handlerMsg = '新增'
        switch (handlerSign) {
          case 'change':
            handlerMsg = '编辑'
            break
        }
        return `${handlerMsg}${msg}`
      },
      isAdd({ handlerSign }) {
        return handlerSign === 'add'
      },
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
          if (this.handlerSign !== 'add' && val) {
            this.formData = { ...val }
          }
        },
        immediate: true,
        deep: true,
      },
    },
    methods: {
      // 提交
      submit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const data = { ...this.formData }
            console.log(data, 'data')
            let requestFn = this.isAdd
              ? 'rules/saveBAgriDivisor'
              : 'rules/updateAgriDivisors'
            this.loading = true
            this.$api(requestFn, data)
              .then((res) => {
                this.$message.success('操作成功')
                this.$emit('change', false)
                this.$emit('getList')
              })
              .finally(() => {
                this.loading = false
              })
          }
        })
      },
    },
  }
  </script>
  <style scoped lang="scss"></style>
  