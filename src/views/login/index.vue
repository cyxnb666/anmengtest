<template>
    <div class="login-main-box">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        label-position="left"
        label-width="0px"
        class="login-form"
      >
        <h3 class="title">
          农险自动化
        </h3>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            auto-complete="off"
            placeholder="账号"
            maxlength="9"
          >
            <svg-icon
              slot="prefix"
              icon-class="user"
              class="el-input__icon input-icon"
            />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon
              slot="prefix"
              icon-class="password"
              class="el-input__icon input-icon"
            />
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            :validate-event="false"
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%;"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon
              slot="prefix"
              icon-class="validCode"
              class="el-input__icon input-icon"
            />
          </el-input>
          <div class="login-code">
            <img
              :src="codeUrl"
              @click="getCode"
              style="width: 100%; height: 100%;"
            />
          </div>
        </el-form-item>
        <el-checkbox v-model="loginForm.rememberMe" style="margin: 0 0 25px 0;">
          记住我
        </el-checkbox>
        <el-form-item style="width: 100%;">
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width: 100%;"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
      <!--  底部  -->
      <div v-if="$store.state.settings.showFooter" id="el-login-footer">
        <span v-html="$store.state.settings.footerTxt" />
        <span>⋅</span>
        <a href="http://www.beian.miit.gov.cn" target="_blank">
          {{ $store.state.settings.caseNumber }}
        </a>
      </div>
    </div>
  </template>
  
  <script>
  import Config from '@/settings'
  import Cookies from 'js-cookie'
  export default {
    name: 'Login',
    data() {
      return {
        userId:'admin123',
        codeUrl: '',
        cookiePass: '',
        loginForm: {
          username: '',
          password: '',
          rememberMe: false,
          code: '',
          uuid: '',
        },
        loginRules: {
          username: [
            { required: true, trigger: 'blur', message: '用户名不能为空' },
          ],
          password: [
            { required: true, trigger: 'blur', message: '密码不能为空' },
          ],
          code: [
            { required: true, trigger: 'change', message: '验证码不能为空' },
          ],
        },
        loading: false,
        redirect: undefined,
      }
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true,
      },
    },
    created() {
      this.getCode()
      this.getCookie()
    },
    methods: {
      getCode() {
        this.$api('common/getCodeImg').then((res) => {
          let obj = res.data || res
          let { base64, uuid } = obj
          this.codeUrl = 'data:image/jpeg;base64,' + base64
          this.loginForm.uuid = uuid
        })
      },
      getCookie() {
        const username = Cookies.get('username')
        let password = Cookies.get('password')
        const rememberMe = Cookies.get('rememberMe')
        // 保存cookie里面的加密后的密码
        this.cookiePass = password === undefined ? '' : password
        password = password === undefined ? this.loginForm.password : password
        let isRememberMe = rememberMe === undefined ? false : Boolean(rememberMe)
        if (isRememberMe) {
          this.loginForm = {
            username: username === undefined ? this.loginForm.username : username,
            password: password,
            rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
            code: '',
          }
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate((valid) => {
          const user = {
            ...this.loginForm,
          }
          localStorage.setItem('username', user.username)
          if (valid) {
            this.loading = true
            if (user.rememberMe) {
              Cookies.set('username', user.username, {
                expires: Config.passCookieExpires,
              })
              Cookies.set('password', user.password, {
                expires: Config.passCookieExpires,
              })
              Cookies.set('rememberMe', user.rememberMe, {
                expires: Config.passCookieExpires,
              })
            } else {
              Cookies.remove('username')
              Cookies.remove('password')
              Cookies.remove('rememberMe')
            }
            this.$store
              .dispatch('user/login', user)
              .then((res) => {
                this.$router.push({ path: '/' })
  
              })
              .catch(() => {
                this.loginForm.code = ''
                this.getCode()
              })
              .finally(() => {
                this.loading = false
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
    },
  }
  </script>
  
  <style scoped lang="scss">
  .login-main-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-size: cover;
    background: url('~@/assets/images/background.jpg');
    ::v-deep {
      .title {
        margin: 0 auto 30px auto;
        text-align: center;
        color: #707070;
      }
  
      .login-form {
        border-radius: 6px;
        background: #ffffff;
        width: 385px;
        padding: 25px 25px 5px 25px;
        .el-input {
          height: 38px;
          input {
            height: 38px;
          }
        }
        .input-icon {
          height: 39px;
          width: 14px;
          margin-left: 2px;
        }
      }
      .login-tip {
        font-size: 13px;
        text-align: center;
        color: #bfbfbf;
      }
      .login-code {
        width: 33%;
        display: inline-block;
        height: 38px;
        float: right;
        img {
          cursor: pointer;
          vertical-align: middle;
        }
      }
    }
  }
  </style>
  