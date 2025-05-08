<template>
    <div class="class-select-line-main">
      <div :class="['left-box', !showSelectPerson ? 'left-box-one' : '']">
        <div
          class="card-title"
          v-if="showSelectPerson"
        >
          选择机构
          <tip-btn type="selectOrg"></tip-btn>
        </div>
        <div class="flex-v org-show-len">
          <div
            class="flex-v show-item"
            v-for="item in listShow"
            :key="item.value"
          >
            <span>{{item.label}}：</span>
            <span>{{selectedOrgConfig[item.value]}}个</span>
          </div>
        </div>
        <el-form
          :model="form"
          :rules="rules"
        >
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText"
            @input="handlerInput"
            v-if="isFilterTree"
          ></el-input>
        </el-form>
        <div class="flex-v" style="margin:10px 0" v-if="isDev&&hasSet">
          <el-input v-model="setOrgList"></el-input>
          <el-button
            type="primary"
            @click="handlerSet"
          >设置机构</el-button>
        </div>
  
        <el-form
          :model="form"
          :disabled="disabled"
        >
          <el-tree
            id="tree-option"
            ref="tree"
            class="tree-box"
            :props="props"
            :node-key="props.value"
            :accordion="disabled?false:true"
            highlight-current
            show-checkbox
            :filter-node-method="filterNode"
            :default-expanded-keys="defaultExpendedKeys"
            :default-checked-keys="defaultCheckedKeys"
            :data="districtFirstOptions"
            :expand-on-click-node="false"
            :check-strictly="true"
            @node-expand="nodeExpand"
            @node-collapse="nodeClose"
            @node-click="handlerNodeClick"
            @check="handlerNodeCheck"
            :disabled="disabled"
            v-bind="$attrs"
            v-on="$listeners"
          >
            <span
              class="custom-tree-node"
              slot-scope="{ node, data }"
            >
              <span>{{ node.label }}<span v-if="isDev">{{'_'+data.comCode}}</span></span>
              <span
                class="select-person-span"
                v-if="isSelectCase && showSelectPerson"
                @click.stop
              >
                <el-switch
                  @change="(e) => handlerSwitch(e, data, node)"
                  v-model="orgForm[data.comCode]"
                  :disabled="disabled"
                  active-color="#13ce66"
                ></el-switch>
              </span>
            </span>
          </el-tree>
        </el-form>
      </div>
      <div
        class="right-box"
        v-if="showSelectPerson"
      >
        <div class="card-title">
          选择人员
          <tip-btn type="selectOrgPerson"></tip-btn>
        </div>
        <div class="org-select-line">
          <span>机构名称：</span>
          <span>{{ currentOrg.comName || '没有选中机构' }}</span>
        </div>
        <div class="right-box-inner">
          <div>
            <el-form :model="form">
              <el-input
                placeholder="请输入姓名/工号/手机号"
                v-model="searchValue"
                clearable
                prefix-icon=" el-icon-search"
                class="search-input"
              ></el-input>
              <el-button
                type="primary"
                @click="onSearch"
              >搜索</el-button>
            </el-form>
          </div>
          <tb-table
            ref="tbTable"
            :loading="loading"
            :pager-config="pagerConfig"
            :table-title="tableTitle"
            :table-data="currentTableData"
            :hasHandler="false"
            @loadPage="loadPage"
            border
            class="table-box"
            :layout="layout"
          >
            <el-table-column
              header-align="center"
              align="center"
              label="选择"
              slot="selection"
            >
              <template #header>
                <el-checkbox
                  :indeterminate="isIndeterminate"
                  v-model="checkAll"
                  :disabled="disabled || !currentTableData.length"
                  @change="handleCheckAllChange"
                ></el-checkbox>
                选择
              </template>
              <template slot-scope="{ row }">
                <el-checkbox
                  v-model="row.checked"
                  :disabled="disabled"
                  @change="(e) => handlerCheckTable(e, row)"
                ></el-checkbox>
              </template>
            </el-table-column>
          </tb-table>
        </div>
      </div>
    </div>
  </template>
  <script>
  import { deepClone } from "@/utils";
  import { getSales, debounce, isJSON } from "@/utils/tools";
  import { getChildrenIds } from "@/utils/tree";
  
  export default {
    props: {
      // 未选中的上级机构
      unSelected: {},
      isShow: {},
      hasSet: {},
      //是否选择人员
      showSelectPerson: {
        default: true,
      },
      flatDistrictOptions: {},
      visible: {},
      disabled: {},
      districtFirstOptions: {},
      //是否区分机构和人员
      isSelectCase: {
        type: Boolean,
        default: false,
      },
      //是否使用单向联动
      isSingle: {
        type: Boolean,
        default: true,
      },
      //是否需要协查员,true不需要，false需要
      queryFlag: {
        type: Boolean,
        default: true,
      },
      initChecked: {
        type: Boolean,
        default: true,
      },
      isFilterTree: {
        type: Boolean,
        default: false,
      },
      /* 配置项 */
      props: {
        type: Object,
        default: () => {
          return {
            value: "comCode", // ID字段名
            label: "comName", // 显示名称
            children: "children", // 子级字段名
          };
        },
      },
    },
    data() {
      return {
        setOrgList: "",
        filterText: "",
        form: {},
        rules: {},
        checkAll: false,
        isIndeterminate: false,
        //开关值的数据
        orgForm: {},
        value: false,
        loading: false,
        tableData: [],
        layout: "total, prev, pager, next, jumper",
        title: `选择可见机构人员`,
        dialogVisible: false,
        defaultExpendedKeys: [],
        defaultCheckedKeys: [],
        searchValue: "",
        currentItem: {},
        pagerConfig: {
          currentPage: 1,
          total: 0,
          pageSize: 9,
        },
        tableTitle: [
          { slot: "selection" },
          { label: "工号/手机号", prop: "surveyorSn" },
          { label: "姓名", prop: "surveyorName" },
        ],
        //选择人员的数组数据
        orgData: {},
        currentOrg: {},
        mapSearch: "",
        listShow: [
          {
            label: "所有机构",
            value: "allLen",
          },
          {
            label: "四级机构",
            value: "forthOrgLen",
          },
          {
            label: "四级以下机构",
            value: "moreLen",
          },
        ],
        selectedOrgConfig: {
          allLen: 0,
          forthOrgLen: 0,
          moreLen: 0,
        },
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
    computed: {
      currentTableData({ pagerConfig, tableData, mapSearch }) {
        return this.getCurrentTableData({ pagerConfig, tableData, mapSearch });
      },
    },
    methods: {
      //获取当前选中的节点的数据
      getCurrentNodeData() {
        this.$nextTick(() => {
          let result = this.$refs.tree.getCheckedNodes();
          let forthOrg = [];
          let moreOrg = [];
          result.forEach((item) => {
            if (item.comLevel == "4") {
              forthOrg.push(item);
            } else if (item.comLevel >= "5") {
              moreOrg.push(item);
            }
          });
          let configData = {
            allLen: result.length,
            forthOrgLen: forthOrg.length,
            moreLen: moreOrg.length,
          };
          this.selectedOrgConfig = {
            ...configData,
          };
        });
      },
      handlerSet() {
        if (isJSON(this.setOrgList)) {
          this.defaultCheckedKeys = JSON.parse(this.setOrgList);
          console.log("设置成功");
        } else {
          this.$message.error("json数据解析失败");
        }
      },
      handlerInput: debounce(function () {
        if (this.isFilterTree && this.$refs.tree)
          this.$refs.tree.filter(this.filterText);
      }, 300),
      filterNode(value, data) {
        if (!value) return true;
        let { label, value: propValue } = this.props;
        return (
          data[label].indexOf(value) !== -1 ||
          data[propValue].indexOf(value) !== -1
        );
      },
      getCurrentTableData({ pagerConfig, tableData, mapSearch }) {
        let { currentPage, pageSize } = pagerConfig;
        if (mapSearch) {
          return tableData.filter(
            (v) =>
              (v.surveyorName && v.surveyorName.indexOf(mapSearch) != -1) ||
              (v.surveyorSn && v.surveyorSn.indexOf(mapSearch) != -1)
          );
        }
        return tableData.slice(
          (currentPage - 1) * pageSize, // 控制因子：全局变量
          currentPage * pageSize
        );
      },
      handleCheckAllChange(val) {
        this.tableData.forEach((it) => {
          if (this.currentTableData.find((v) => v.surveyorSn === it.surveyorSn)) {
            it.checked = val;
          }
        });
        this.$nextTick(() => {
          this.handlerCheckTable();
        });
      },
      // 初始化数据
      init(config = {}) {
        console.log(config, "config");
        //不区分选择机构还是人员
        if (!this.isSelectCase) {
          let org = {};
          Object.keys(config).forEach((v) => {
            org[v] = config[v];
          });
          this.orgData = org;
          let arr = Object.keys(this.orgData);
          // this.defaultCheckedKeys = arr
  
          console.log(arr, "arr");
          console.log(this.orgData, "orgData");
          this.$nextTick(() => {
            this.setTreeChecked(arr, true);
          });
        } else {
          // 区分选择机构和人员
          let { personnelScope = {}, salesOrganization = [] } = config;
          let orgForm = {};
          let personnelScopeData = {};
          salesOrganization.forEach((key) => {
            personnelScopeData[key] = null;
            orgForm[key] = false;
          });
          Object.keys(personnelScope).forEach((key) => {
            personnelScopeData[key] = personnelScope[key];
            orgForm[key] = personnelScope[key] ? true : false;
          });
          this.orgForm = orgForm;
          this.orgData = deepClone(personnelScopeData);
          this.defaultCheckedKeys = Object.keys(this.orgData);
          if (this.isDev) {
            this.setOrgList = JSON.stringify(this.defaultCheckedKeys);
          }
        }
        if (this.disabled || this.isShow) {
          this.defaultExpendedKeys = deepClone(this.unSelected);
        }
        this.getCurrentNodeData();
        this.setIndeterminateState(this.unSelected);
      },
      setIndeterminateState(nodeKeys) {
        const allNodes = this.$refs.tree.store.nodesMap;
        for (let key in allNodes) {
          if (nodeKeys.includes(key)) {
            allNodes[key].indeterminate = true;
          } else {
            allNodes[key].indeterminate = false;
          }
        }
      },
      //获取label
      getLabelById(arr) {
        const result = [];
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
        return result;
      },
      //确定选择数据
      submit(isGetSale = false) {
        let config = {};
  
        let arr = this.$refs.tree.getCheckedKeys();
        let checkValueList = this.getLabelById(arr);
        if (!this.isSelectCase) {
          arr.forEach((it) => {
            config[it] = this.orgData[it] || null;
          });
        } else {
          let salesOrganization = [];
          let personnelScope = {};
          arr.forEach((key) => {
            if (this.orgData[key] && this.orgForm[key]) {
              personnelScope[key] = this.orgData[key];
            } else {
              salesOrganization.push(key);
            }
          });
          let salesOrganizationList = isGetSale
            ? getSales(salesOrganization)
            : salesOrganization;
          config = {
            personnelScope,
            salesOrganization: salesOrganizationList,
          };
        }
        this.$emit("onConfirmCheck", deepClone(checkValueList));
        this.$emit("onConfirm", deepClone(config));
        return deepClone(config);
      },
      handlerSwitch(e, data, node) {
        if (e) this.handlerNodeClickExec(data, node);
      },
      getIsSwitch(val) {
        return val && this.selectPerson.includes(val);
      },
  
      handlerCheckTable() {
        let comCode = this.currentOrg.comCode;
        let list = this.orgData[comCode] || [];
        list = this.tableData
          .filter((it) => it.checked)
          .map((it) => it.surveyorSn);
        this.orgData[comCode] = list;
        this.getCheckALl();
        this.$forceUpdate();
      },
      noRepeat(arr) {
        var newArr = [...new Set(arr)]; //利用了Set结构不能接收重复数据的特点
        return newArr;
      },
      //选择
      handlerNodeCheck(data, { checkedKeys } = {}) {
        let checked = checkedKeys.includes(data.comCode);
        if (checked) {
          if (this.currentOrg.comCode) {
            this.orgData[this.currentOrg.comCode] = this.tableData
              .filter((it) => it.checked)
              .map((it) => it.surveyorSn);
          }
        } else {
          delete this.orgData[data.comCode];
          this.setCurrentTable(data.comCode);
        }
        this.updateParentCheckState(data);
        let arr = getChildrenIds(data.comCode, this.flatDistrictOptions);
        if (this.isSingle) this.setTreeChecked(arr, checked);
        this.getCurrentNodeData();
      },
      //半选中
      updateParentCheckState(node) {
        // 遍历树形数据，找到当前节点的所有父节点
        const parents = this.getParentNodes(node, this.districtFirstOptions);
        console.log(parents, "parents");
        parents.forEach((parent) => {
          // 检查父节点是否还有其他未被选中的子节点
          const hasUncheckedChild = parent.childNodes.some(
            (child) => !child.checked
          );
          // 设置父节点的半选中状态
          parent.indeterminate = !parent.checked;
          hasUncheckedChild && parent.childNodes.some((child) => child.checked);
        });
      },
      getParentNodes(data, tree) {
        let parents = [];
        let currentNode = this.$refs.tree.getNode(data.comCode);
        while (currentNode.parent) {
          currentNode = currentNode.parent;
          parents.unshift(currentNode);
        }
        parents.splice(0, 1);
        // parents = parents.map((it) => it.data);
        console.log(parents, "2");
        return parents;
      },
      setCurrentTable(comCode) {
        if (comCode === this.currentOrg.comCode) {
          this.currentOrg = {};
          this.tableData = [];
        }
      },
      setTreeChecked(arr, checked) {
        arr.forEach((v) => {
          if (!checked) {
            delete this.orgData[v];
            this.setCurrentTable(v);
          }
          this.$refs.tree.setChecked(v, checked);
        });
      },
      loadPage() {
        this.getCheckALl();
      },
      //搜索人员
      onSearch() {
        this.pagerConfig.currentPage = 1;
        this.mapSearch = this.searchValue;
      },
      //点击
      handlerNodeClick(data, node) {
        if (!this.showSelectPerson) {
          return;
        }
        let { comCode } = data;
  
        let isFlag = this.isSelectCase;
        if (this.orgForm[comCode]) {
          isFlag = false;
        }
        if (isFlag) return;
        this.handlerNodeClickExec(data, node);
      },
      handlerNodeClickExec(data, node) {
        let { comCode } = data;
        if (!comCode) {
          return;
        }
        if (!this.orgData[comCode]) {
          this.orgData[comCode] = null;
        }
        data.checked = node.checked || node.indeterminate;
        this.currentOrg = deepClone(data);
        this.$nextTick(() => {
          this.getCurrentOrgPerson(comCode);
        });
      },
      getCurrentOrgPerson(orgNo) {
        queryAgentSurveor({ orgNo, queryFlag: this.queryFlag }).then((res) => {
          if (res.code === 200) {
            let list = res.data || [];
            let { comCode, checked } = this.currentOrg;
            let dataList = this.orgData[comCode];
            if (!dataList && checked) {
              this.orgData[comCode] = this.initChecked
                ? list.map((it) => it.surveyorSn)
                : [];
            }
            if (this.orgData[comCode]) {
              list.forEach((it) => {
                it.checked = this.orgData[comCode].includes(it.surveyorSn);
              });
            } else {
              list.forEach((it) => {
                it.checked = this.initChecked;
              });
            }
  
            this.tableData = list;
            this.pagerConfig.total = list.length;
            this.getCheckALl();
          }
        });
      },
      //是否全选
      getCheckALl() {
        this.$nextTick(() => {
          let count = 0;
          this.currentTableData.forEach((it) => {
            if (it.checked) {
              count++;
            }
          });
          this.checkAll = count && count === this.currentTableData.length;
          this.isIndeterminate =
            count && !this.checkAll && this.currentTableData.length
              ? true
              : false;
        });
      },
  
      // 节点展开操作
      nodeExpand(data) {
        // this.defaultExpendedKeys.push(data.comCode);
      },
      nodeClose(data) {
        /* this.defaultExpendedKeys = this.defaultExpendedKeys.filter(
          (item) => item !== data.comCode
        ); */
      },
    },
  };
  </script>
  <style scoped lang="scss">
  .class-select-line-main {
    display: flex;
  
    .right-box-inner {
      max-height: 580px;
      overflow: auto;
    }
    .card-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .org-select-line {
      margin-bottom: 12px;
    }
    .left-box {
      width: 48%;
      margin-right: 12px;
    }
  
    .tree-box {
      height: 500px;
      overflow: auto;
    }
    .left-box-one {
      width: 100%;
      .tree-box {
        height: 400px;
      }
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
    .org-show-len{
      margin-bottom: 10px ;
      font-weight: bold;
      .show-item{
        margin-right: 10px;
      }
    }
  }
  </style>
  