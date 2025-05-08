<template>
    <div>
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="旧密码"
          prop="oldPassword"
        >
          <el-input
            v-model="formData.oldPassword"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newPassword"
        >
          <el-input
            v-model="formData.newPassword"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="rePassword"
        >
          <el-input
            v-model="formData.rePassword"
            show-password
            clearable
          />
        </el-form-item>
      </el-form>
    </div>
  </template>
  <script>
  import { mapGetters } from 'vuex'
  export default {
    data() {
      const validateRePwd = (rule, value, callback) => {
        if (
          value &&
          this.formData.newPassword &&
          this.formData.newPassword !== value
        ) {
          callback(new Error('两次密码输入不一致'))
        } else {
          callback()
        }
      }
      return {
        rules: {
          oldPassword: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            }
          ],
          newPassword: [
            {
              required: true,
              message: '请输入新密码',
              trigger: 'blur'
            },
            {
              pattern: /^[A-z]([A-z]|[0-9]){5,19}$/,
              message: '请输入6-20位由字母数字组成的密码，小写字母或大写字母开头',
              trigger: 'blur'
            }
          ],
          rePassword: [
            {
              required: true,
              message: '请输入确认密码',
              trigger: 'blur'
            },
            {
              trigger: 'blur',
              validator: validateRePwd
            },
            {
              pattern: /^[A-z]([A-z]|[0-9]){5,19}$/,
              message: '请输入6-20位由字母数字组成的密码，小写字母或大写字母开头',
              trigger: 'blur'
            }
          ]
        },
        formData: {}
      }
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    methods: {
      validateForm() {
        return new Promise((resolve, reject) => {
          this.$refs.form.validate((valid) => {
            if (valid) {
              changePwd({ ...this.formData, username: this.userInfo.username }).then((res) => {
                resolve()
              }).catch(() => {
                reject()
              })
            } else {
              reject()
            }
          })
        })
      }
    }
  }
  </script>
  <style scoped lang='scss'>
  </style>
  