<template>
    <div class="search-input-main">
      <div
        class="search-input"
        readonly
      >
        <div
          class="search-input-inner"
          @click="handlerChangeOrg()"
        >
          <span
            v-for="(item, i) in value"
            :key="i"
            class="inner-span"
          >
            {{ item }}
          </span>
          <span
            v-show="!value || !value.length"
            class="placeholder-style"
          >
            {{ placeholder }}
          </span>
        </div>
        <div class="del-icon-box">
          <span
            class="el-icon-circle-close del-icon"
            @click="delOrg"
            v-show="value && value.length&&hasDel"
          ></span>
        </div>
      </div>
      <el-button
        @click="handlerView()"
        type='primary'
        v-if="hasView"
        class="view-btn"
      >查看</el-button>
      <Org
        v-bind="$attrs"
        v-model="visibleOrg"
        v-if="visibleOrg"
        ref="org"
        :isFilterTree="true"
        :isShow="isShow"
        :title="title"
        :isSelectCase="true"
        :showSelectPerson="false"
        width="800px"
        :flatDistrictOptions="flatDistrictOptions"
        @onConfirm="onConfirm"
      ></Org>
    </div>
  </template>
  <script>
  import Org from "./org";
  import { getObjLabel } from "@/utils/tools";
  export default {
    name: "SearchOrg",
    components: {
      Org,
    },
    props: {
      isSync: {},
      //是否有查看
      hasView: {},
      hasDel: {
        default: true,
      },
      placeholder: {
        default: "请点击选择机构",
      },
      flatDistrictOptions: {
        default: () => {
          return [];
        },
      },
      data: {},
    },
    data() {
      return {
        isShow: false,
        title: "选择机构",
        value: [],
        visibleOrg: false,
        props: {
          value: "comCode", // ID字段名
          label: "comName", // 显示名称
          children: "children", // 子级字段名
        },
      };
    },
    watch: {
      data: {
        handler(val) {
          if (val) {
            this.getInit();
          }
        },
        immediate: true,
        deep: true,
      },
      flatDistrictOptions: {
        handler(val) {
          if (val) {
            this.getInit();
          }
        },
        immediate: true,
        deep: true,
      },
    },
    methods: {
      delOrg() {
        this.$emit("update:data", []);
      },
      getInit() {
        let val = this.data;
        let config = {
          ...this.props,
          val,
          arr: this.flatDistrictOptions,
          sliceNum: 7,
          isArrResult: true,
          isArr: true,
        };
        let value = val && val.length ? getObjLabel(config) : [];
        this.value = value;
      },
      //获取label
      getLabelById(arr) {
        const result = [];
        if (this.flatDistrictOptions && this.flatDistrictOptions.length) {
          let { label, value } = this.props;
          arr.forEach((it) => {
            let hasItem = this.flatDistrictOptions.find((v) => v[value] === it);
            if (hasItem) {
              result.push({
                label: hasItem[label],
                value: it,
              });
            }
          });
        }
  
        return result;
      },
      onConfirm(e) {
        if (this.isSync) {
          return this.$emit("updateData", e.salesOrganization);
        }
        this.$emit("update:data", e.salesOrganization);
        this.$emit("clearValidate");
        this.visibleOrg = false;
      },
      closeVisble() {
        this.visibleOrg = false;
      },
      handlerView() {
        this.handlerChangeOrg(true)
      },
      //选择机构
      handlerChangeOrg(isShow=false) {
        this.isShow=isShow
        console.log(this.isShow,'isShow')
        let data = {
          salesOrganization: this.data || [],
          personnelScope: [],
        };
        this.visibleOrg = true;
        this.$nextTick(() => {
          this.$refs.org.init(data);
        });
      },
    },
  };
  </script>
  <style scoped lang="scss">
  .search-input-main {
    display: flex;
    align-items: center;
    width: 100%;
    .view-btn {
      margin-left: 5px;
    }
    .search-input {
      height: 32px;
      padding: 0 0px 0 15px;
      border-radius: 5px;
      color: #303133;
      border: 1px solid #e6ebf5;
      position: relative;
      display: flex;
      // width: 100%;
      flex: 1;
      overflow: hidden;
  
      .search-input-inner {
        cursor: pointer;
        margin-right: 5px;
        height: 100%;
        // width: 100%;
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
  
        .inner-span {
          background-color: #f4f4f5;
          border-color: #e9e9eb;
          color: #909399;
          margin-right: 5px;
          padding: 2px 5px;
        }
      }
      .del-icon-box {
        width: 30px;
        text-align: center;
  
        .del-icon {
          color: #c0c4cc;
          font-size: 14px;
          cursor: pointer;
        }
      }
      .placeholder-style {
        color: #c0c4cc;
      }
    }
  }
  </style>
  