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
        <el-form-item label="常量名称：" prop="constantName">
          <el-input
            v-model="formData.constantName"
            clearable
            :maxlength="20"
            placeholder="请输入常量名称"
          />
        </el-form-item>
        <el-form-item label="常量代码：" prop="constantKey">
          <el-input
            v-model="formData.constantKey"
            clearable
            :disabled="!isDev&&!isAdd"
            :maxlength="20"
            placeholder="请输入常量代码"
          />
        </el-form-item>
        <el-form-item label="常量值：" prop="constantValue">
          <el-input
            v-model="formData.constantValue"
            clearable
            :disabled="!isDev&&!isAdd"
            :maxlength="100"
            placeholder="请输入常量值"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="constantStatus">
          <el-radio-group v-model="formData.constantStatus">
            <el-radio
              :label="item.value"
              v-for="item in statusOptions"
              :key="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述：" prop="constantDesc">
          <el-input
            v-model="formData.constantDesc"
            clearable
            :maxlength="200"
            :autosize="{ minRows: 2, maxRows: 6 }"
            type="textarea"
            placeholder="请输入描述"
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
  import {getObjData} from '@/utils/tools'
  
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
        loading:false,
        dialogVisible: false,
        factorTypeOptions,
        factorClassifyOptions,
        judgeOptions,
        statusOptions,
        formData: {
          constantStatus: '1',
        },
        rules: {
          constantKey: [
            {
              required: true,
              message: '请输入常量代码',
              trigger: 'blur',
            },
            {
              pattern: /^[\da-zA-Z\_\-]{1,50}$/,
              message: '代码可输入字母、数字，中划线，下划线等',
              trigger: 'blur',
            },
          ],
          constantName: [
            {
              required: true,
              message: '请输入常量名称',
              trigger: 'blur',
            },
          ],
          constantValue: [
            {
              required: true,
              message: '请输入常量代码',
              trigger: 'blur',
            },
          ],
          constantStatus: [
            {
              required: true,
              message: '状态不能为空',
              trigger: 'blur',
            },
          ],
        },
        defaultCheckedKeys: [],
      }
    },
    computed: {
      title({ handlerSign }) {
        let msg = '常量'
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
            const arr=[
              'id',
              'constantName',
              'constantKey',
              'constantValue',
              'constantStatus',
              'constantDesc',
            ]
            this.formData = getObjData(val,arr)
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
              ? 'base/addConstant'
              : 'base/updateConstant'
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
  