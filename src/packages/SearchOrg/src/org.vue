<template>
    <t-dialog
      v-bind="$attrs"
      v-on="$listeners"
      v-model="dialogVisible"
      :title="title"
      :disabled="isShow||disabled"
      :width="width"
      :closeOnClickModal="isShow||disabled"
      append-to-body
      @comfirmBtn="submit"
      class="class-select-line-main-content"
    >
      <orgItem
        :disabled="isShow||disabled"
        :isFilterTree="true"
        :unSelected="unSelected"
        :isShow="isShow"
        :districtFirstOptions="disabled||isShow?districtFirstOptionsShow:districtFirstOptions"
        v-bind="$attrs"
        v-on="$listeners"
        ref="orgItem"
      />
    </t-dialog>
  </template>
  <script>
  import { deepClone } from "@/utils/tools";
  import {  handerTree } from "@/utils/tree";
  import orgItem from "./orgItem.vue";
  export default {
    props: {
      visible: {},
      disabled: {},
      districtFirstOptions: {},
      width: {
        default: "800px",
      },
      title: {
        default: "选择机构",
      },
      //是否只展示已选中的
      isShow: {
        default: false,
      },
    },
    components: {
      orgItem,
    },
    data() {
      return {
        form: {},
        districtFirstOptionsShow: [],
        unSelected: [],
        dialogVisible: false,
      };
    },
    model: {
      prop: "visible",
      event: "change",
    },
    watch: {
      visible: {
        handler(val) {
          this.dialogVisible = val;
        },
        immediate: true,
      },
      dialogVisible(val) {
        this.$emit("change", val);
      },
    },
    methods: {
      getRelShowData(selectedIds) {
        let treeData = deepClone(this.districtFirstOptions);
        const unSelected = [];
        this.districtFirstOptionsShow =
          handerTree(treeData, selectedIds, {
            id: "comCode",
            unSelected,
          }) || [];
        this.unSelected = unSelected;
      },
      init(config) {
        this.getRelShowData(config.salesOrganization);
        this.$nextTick(() => {
          this.$refs.orgItem.init(config);
        });
      },
      submit() {
        this.$refs.orgItem.submit();
      },
    },
  };
  </script>
  <style scoped lang="scss">
  .class-select-line-main-content {
    .class-select-line-main {
      display: flex;
  
      .right-box-inner {
        max-height: 580px;
        overflow: auto;
      }
      .card-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .org-select-line {
        margin-bottom: 12px;
      }
      .left-box {
        width: 48%;
        margin-right: 12px;
      }
      .tree-box {
        height: 530px;
        overflow: auto;
      }
      .right-box {
        flex: 1;
      }
      .search-input {
        margin-bottom: 12px;
        width: 300px;
      }
      .table-box {
        width: 100%;
      }
      .select-person-span {
        margin-left: 20px;
      }
    }
    ::v-deep {
      .el-dialog__body {
        padding: 15px 15px 0;
      }
      .el-tree-node {
        margin: 4px 0;
      }
      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 60px;
      }
      .table-container-main {
        padding-bottom: 0;
      }
    }
  }
  </style>
  