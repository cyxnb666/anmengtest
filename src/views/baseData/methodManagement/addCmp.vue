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
        <el-form-item label="函数名称：" prop="targetFunctionName">
          <el-input
            v-model="formData.targetFunctionName"
            clearable
            :maxlength="20"
            placeholder="请输入函数名称"
          />
        </el-form-item>
        <el-form-item label="类路径：" prop="classPath">
          <el-select
            v-model="formData.classPath"
            :disabled="!isAdd"
            @change="handlerChangeClassPath"
            placeholder="请选择类路径"
          >
            <el-option
              :label="item"
              :value="item"
              v-for="item in classOptions"
              :key="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类方法：" prop="methodName">
          <el-select
            v-model="formData.methodName"
            placeholder="请选择类方法"
            filterable
            :disabled="!isAdd"
          >
            <el-option
              :label="item.key"
              :value="item.value"
              v-for="item in methodOptions"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
  
        <el-form-item label="状态：" prop="targetFunctionStatus">
          <el-radio-group v-model="formData.targetFunctionStatus">
            <el-radio
              :label="item.value"
              v-for="item in statusOptions"
              :key="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="函数描述：" prop="targetFunctionDesc">
          <el-input
            v-model="formData.targetFunctionDesc"
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
  import { getObjData } from '@/utils/tools'
  export default {
    props: {
      classOptions: {},
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
        methodOptions: [],
        loading: false,
        dialogVisible: false,
        factorTypeOptions,
        factorClassifyOptions,
        judgeOptions,
        statusOptions,
        formData: {
          targetFunctionStatus: '1',
          methodName: '',
        },
        rules: {
          functionCode: [
            {
              required: true,
              message: '请输入函数代码代码',
              trigger: 'blur',
            },
            {
              pattern: /^[\da-zA-Z\_\-]{1,50}$/,
              message: '代码可输入字母、数字，中划线，下划线等',
              trigger: 'blur',
            },
          ],
          targetFunctionName: [
            {
              required: true,
              message: '请输入函数名称',
              trigger: 'blur',
            },
          ],
          methodName: [
            {
              required: true,
              message: '请选择类方法',
              trigger: 'change',
            },
          ],
          classPath: [
            {
              required: true,
              message: '请选择类路径',
              trigger: 'change',
            },
          ],
          targetFunctionStatus: [
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
    computed: {
      title({ handlerSign }) {
        let msg = '函数'
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
            const arr = [
              'id',
              'targetFunctionName',
              'methodName',
              'classPath',
              'functionCode',
              'targetFunctionStatus',
              'targetFunctionDesc',
            ]
            this.handlerChangeClassPath(val.classPath, true)
            this.formData = getObjData(val, arr)
          }
        },
        immediate: true,
        deep: true,
      },
    },
    methods: {
      getMethod(classpath) {
        this.$api(`base/queryMethod`, { classpath }).then((res) => {
          this.methodOptions = res.data || []
        })
      },
      handlerChangeClassPath(e, isInit = false) {
        if (!isInit) this.formData.methodName = ''
        this.getMethod(e)
      },
      // 提交
      submit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const data = { ...this.formData }
            data.functionCode=data.methodName
            console.log(data, 'data')
            let requestFn = this.isAdd ? 'base/addTarget' : 'base/updateTarget'
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
  