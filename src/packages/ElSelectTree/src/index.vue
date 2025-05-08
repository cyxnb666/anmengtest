<template>
    <div>
      <div
        @click="dialogVisible = true"
        :class="{'labelBox':true,'is-disabled-common':disabled}"
      >
        <span
          v-for="item in endcomLabels"
          :key="item[props.value]"
          class="labelSty el-tag el-tag--info el-tag--mini el-tag--light"
        >{{ item[props.label] }}</span>
      </div>
      <t-dialog
        v-bind="$attrs"
        v-on="$listeners"
        v-model="dialogVisible"
        :title="title"
        @comfirmBtn="submit"
        @cancel="cancel"
        :closeOnClickModal="true"
        :hasCancelBtn="false"
      >
        <div class="leftBox">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText"
            class="input-style"
          >
          </el-input>
          <el-tree
            id="tree-option"
            ref="tree"
            :props="props"
            :node-key="props.value"
            accordion
            highlight-current
            :filter-node-method="filterNode"
            :default-expanded-keys="defaultExpendedKeys"
            :default-checked-keys="defaultCheckedKeys"
            :data="options"
            @check-change="checkChange"
            @node-expand="nodeExpand"
            @node-collapse="nodeClose"
            v-bind="$attrs"
            v-on="$listeners"
          >
          </el-tree>
        </div>
      </t-dialog>
    </div>
  </template>
  <script>
  export default {
    name: "ElSelectTree",
    props: {
      visible: {},
      title: {
        default: "选择销售区域",
      },
      options: {
        type: Array,
        default: () => [],
      },
      //是否禁用
      disabled: {},
      // 选中的值
      checked: {},
      /* 配置项 */
      props: {
        type: Object,
        default: () => {
          return {
            value: "id", // ID字段名
            label: "title", // 显示名称
            children: "children", // 子级字段名
          };
        },
      },
    },
    data() {
      return {
        dialogVisible: false,
        filterText: "",
        endcomLabels: [],
        defaultCheckedKeys: [],
        defaultExpendedKeys: [],
      };
    },
    mounted() {},
    methods: {
      // 节点展开操作
      nodeExpand(data) {
        this.defaultExpendedKeys.push(data.id);
      },
      nodeClose(data) {
        this.defaultExpendedKeys = this.defaultExpendedKeys.filter(
          (item) => item !== data.id
        );
      },
      filterNode(value, data) {
        if (!value) return true;
        let { label } = this.props;
        return data[label].indexOf(value) !== -1;
      },
      submit() {
        let checked = this.$refs.tree.getCheckedKeys();
        this.$emit("update:checked", JSON.parse(JSON.stringify(checked)));
        this.$nextTick(() => {
          this.getLabels();
          this.dialogVisible = false;
        });
      },
      checkChange() {
        let checked = this.$refs.tree.getCheckedKeys();
        this.$emit("update:checked", JSON.parse(JSON.stringify(checked)));
        this.getLabels();
      },
      getLabels() {
        if (this.$refs.tree) {
          this.endcomLabels = this.$refs.tree.getCheckedNodes();
        } else {
          let result = [];
          this.getLabelByKey(this.options, { result, keys: this.checked });
          this.endcomLabels = result;
        }
      },
      getLabelByKey(tree, { result = [], keys = [] } = {}) {
        if (tree.length) {
          tree.forEach((it) => {
            let { label, value } = this.props;
            if (keys.includes(it[value])) {
              result.push({ [label]: it[label] });
            }
            if (it.children && it.children.length) {
              this.getLabelByKey(it.children, { result, keys });
            }
          });
        }
      },
      setKeys(val) {
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys(val);
        }
      },
      cancel() {},
      isSeam(arr, prev) {
        let flag = false;
        if (arr&&prev&&arr.length == prev.length) {
          flag = arr.every((v) => prev.includes(v));
        }
        return flag;
      },
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      dialogVisible(val) {
        if (val) {
          this.getLabels();
        } else {
          this.getLabels();
          this.$emit("clearValid");
        }
      },
      checked: {
        handler(val) {
          if (!this.isSeam(val, this.defaultCheckedKeys)) {
            this.defaultCheckedKeys = JSON.parse(JSON.stringify(val)) || [];
          }
        },
        immediate: true,
        deep: true,
      },
      options: {
        handler(val) {
          if (val.length) {
            this.getLabels();
          }
        },
        immediate: true,
        deep: true,
      },
    },
  };
  </script>
  <style scoped lang='scss'>
  .labelBox {
    width: 400px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    cursor: pointer;
    padding: 0 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
    .labelSty {
      margin-right: 10px;
    }
  }
  .leftBox {
    // width: 440px;
    height: 60vh;
    overflow-x: scroll;
    overflow-y: scroll;
    border-right: 1px solid #ccc;
    padding-right: 20px;
  }
  </style>