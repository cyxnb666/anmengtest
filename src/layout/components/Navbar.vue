<template>
    <div class="navbar">
      <hamburger
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
  
      <breadcrumb class="breadcrumb-container" />
  
      <div class="right-menu">
        <div class="screen-box">
        </div>
        <template v-if="device!=='mobile'">
          <search
            id="header-search"
            class="right-menu-item"
          />
  
          <screenfull
            id="screenfull"
            class="right-menu-item hover-effect"
          />
  
        </template>
        <span class="right-menu-item" >{{decodeURIComponent(userInfo.userName)}}</span>
  
        <el-dropdown
          class="avatar-container"
          trigger="click"
        >
          <div class="avatar-wrapper">
            <img
              :src="avatar+'?imageView2/1/w/80/h/80'"
              class="user-avatar"
            >
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu
            slot="dropdown"
            class="user-dropdown"
          >
            <!-- <el-dropdown-item @click.native="openDialog">修改密码</el-dropdown-item> -->
  
            <el-dropdown-item
              divided
              @click.native="logout"
            >
              <span style="display:block;">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <tb-dialog
        v-if="dialogVisible"
        v-model="dialogVisible"
        v-drag
        :loading="loading"
        title="修改密码"
        :append-to-body="true"
        @comfirmBtn="comfirmBtn"
      >
        <ChangePassword ref="changePwdEl" />
      </tb-dialog>
    </div>
  </template>
  
  <script>
  import { mapGetters } from "vuex";
  import Breadcrumb from "@/components/Breadcrumb";
  import Hamburger from "@/components/Hamburger";
  import ChangePassword from "./ChangePassword";
  import Screenfull from "@/components/Screenfull";
  import Search from "@/components/HeaderSearch";
  import { getToken } from "@/utils/auth";
  export default {
    components: {
      Breadcrumb,
      Hamburger,
      ChangePassword,
      Screenfull,
      Search,
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        userInfo: getToken(),
      };
    },
    computed: {
      ...mapGetters(["sidebar", "avatar", "device"])
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch("app/toggleSideBar");
      },
      async logout() {
        await this.$store.dispatch("user/logout");
        this.$router.push(`/login`);
      },
      openDialog() {
        this.dialogVisible = true;
      },
      comfirmBtn() {
        this.loading = true;
        this.$refs.changePwdEl
          .validateForm()
          .then(() => {
            this.loading = false;
            this.dialogVisible = false;
            this.$alert("密码修改成功，请重新登录！", {
              confirmButtonText: "确定",
              callback: () => {
                this.logout();
              },
            });
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  
    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;
  
      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  
    .breadcrumb-container {
      float: left;
    }
  
    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;
  
      &:focus {
        outline: none;
      }
  
      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;
  
        &.hover-effect {
          cursor: pointer;
          transition: background 0.3s;
  
          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
        }
      }
  
      .avatar-container {
        margin-right: 30px;
  
        .avatar-wrapper {
          margin-top: 5px;
          position: relative;
  
          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
  
          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
    ::v-deep {
      .el-dialog__footer {
        text-align: center;
      }
    }
    .screen-box {
      display: inline-block;
      height: 100%;
      vertical-align: text-bottom;
      margin-right: 15px;
    }
  }
  </style>
  