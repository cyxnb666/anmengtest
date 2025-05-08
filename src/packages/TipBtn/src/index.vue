<template>
    <el-popover
      placement="top"
      title="说明"
      width="200"
      trigger="click"
      :content="content"
    >
      <i
        class="el-icon-question"
        slot="reference"
      >
      </i>
    </el-popover>
  
  </template>
  <script>
  export default {
    name:"TipBtn",
    props: {
      //提示type
      type: {
        default: "notice",
      },
      customTip:{
        
      }
    },
    data() {
      return {
        tips: {
          //产品
          notice: `选择告知代码后，回显告知类型、告知名称、内容信息`,
          addNotice:`点击新增告知信息，会新增一条包含告知代码、告知类型、告知内容的告知信息`,
          addProblem:`选择常见问题，可以点击每一条问题后的加号进行新增，保存后会同步到基础数据中`,
          addScheme:`新增一组方案信息，包括方案基本信息+险别条款信息+特约信息+增值服务。点击每个标签可以进行相应方案的修改`,
          special:`选择特约代码后，回显特约名称和内容`,
          addServer:`选择服务代码之后，会同步回显相应的增值服务内容`,
          moduleTitle:`副标题展示在模块标题下，当添加多个动态模块时，第二个模块展示的副标题为二级副标题。如：多个被保人，第一个被保人下展示户主，第二个被保人下可以展示成家庭成员。`,
          moduleTip:`展示在模块标题的右方，用于提示用户某些信息`,
          dyamicNumTip:`可输入纯数字，也可以输入数字区间，用中划线-隔开，如:0-4`,
          //营销活动
          camDetail:`可配置活动图片，活动视频及活动的详情规则说明`,
          accumulativeTip:`点击可查看积分明细记录`,
          activityTarget:`目标值活动形式的统计项及目标值配置，仅用于统计展示，实际的积分以活动规则的配置赠送`,
          selectOrg:"打开开关可以选择机构下的具体人员",
          selectOrgPerson:"可点击勾选框勾选人员"
        },
      };
    },
    computed:{
      content({tips,type}){
        return tips[type]||this.customTip||''
      }
    },
    methods: {
    },
  };
  </script>
  <style scoped lang='scss'>
  .el-icon-question {
    color: #ccc;
    font-size: 20px;
    cursor: pointer;
    &:hover{
      color: rgb(177, 141, 141);
    }
  }
  </style>