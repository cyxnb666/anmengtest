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
       <el-form-item label="角色编码：" prop="id">
          <el-input
            v-model.trim="formData.id"
            clearable
            :maxlength="100"
            disabled
            placeholder="系统生成"
          />
        </el-form-item>
        <el-form-item label="角色名称：" prop="roleName">
          <el-input
            v-model="formData.roleName"
            clearable
            :maxlength="20"
            placeholder="请输入角色名称"
          />
        </el-form-item>
  
        <el-form-item label="状态：" prop="validStatus">
          <el-radio-group v-model="formData.validStatus">
            <el-radio
              :label="item.value"
              v-for="item in statusOptions"
              :key="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色描述：" prop="roleDesc">
          <el-input
            v-model="formData.roleDesc"
            clearable
            :maxlength="200"
            :autosize="{ minRows: 2, maxRows: 6 }"
            type="textarea"
            placeholder="请输入角色描述"
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
      methodOptions:{},
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
          validStatus: '1',
        },
        rules: {
          /* roleCode: [
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
          ], */
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
    computed: {
      title({ handlerSign }) {
        let msg = '角色'
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
            console.log(data,'data')
            let requestFn = this.isAdd
              ? 'user/addRole'
              : 'user/updateRole'
              this.loading=true
            this.$api(requestFn, data).then((res) => {
              this.$message.success('操作成功')
              this.$emit('change',false)
              this.$emit('getList')
            }).finally(()=>{
              this.loading=false
  
            })
          } 
        })
      },
    },
  }
  </script>
  <style scoped lang="scss"></style>
  