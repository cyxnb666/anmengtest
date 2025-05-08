// 因子分类
export const factorClassifyOptions = [
    {
      label: "核赔类",
      value: "veric"
    }
  ];
  export const ruleNodeOptions = [
    {
      label: '立案',
      value: 'claim',
    },
    {
      label: '单证',
      value: 'certi',
    },
    {
      label: '理算',
      value: 'compe',
    },
    {
      label: '核赔',
      value: 'veric',
    },
  ];
  // 因子类型
  export const factorTypeOptions = [
    {
      label: "损失数量",
      value: "lossNum"
    },
    {
      label: "损失金额",
      value: "lossSum"
    },
    {
      label: "影像资料",
      value: "imageData"
    },
  ];
  // 状态
  export const statusOptions = [
    {
      label: "正常",
      value: '1'
    },
    {
      label: "失效",
      value: '0'
    },
  ];
  // 状态
  export const judgeOptions = [
    {
      label: "是",
      value: '1'
    },
    {
      label: "否",
      value: '0'
    },
  ];
  // 延期单证提供方式
  export const delayProvidedOptions = [
    {
      label: "延期提供",
      value: '1'
    },
    {
      label: "无需提供",
      value: '0'
    },
  ];
  // 状态
  export const statusBoolOptions = [
    {
      label: "是",
      value: true
    },
    {
      label: "否",
      value: false
    },
  ];
  //ocr类型
  export const ocrOptions = [
    {
      label: "银行卡",
      value: '1'
    },
    {
      label: "身份证",
      value: '2'
    },
    {
      label: "营业执照",
      value: '3'
    },
    {
      label: "电子表格",
      value: '4'
    },
  ];
  //ai类型
  export const aiOptions = [
    {
      label: "人",
      value: '1'
    },
    {
      label: "物",
      value: '2'
    }
  ];
  // 保险性质选项配置
export const insuranceNatureOptions = [
  {
    label: "商业性",
    value: "commercial"
  },
  {
    label: "政策性", 
    value: "ply"
  },
];
  //规则状态类型
  export const ruleStatusOptions = [
    {
      label: "运行中",
      value: 'running',
      color: "#70B603",
      bgColor: "#F5FEE6",
    },
    {
      label: "历史发布",
      value: 'hisPublish',
      color: "#6E6969",
      bgColor: "#EAE4E4",
      isDetail: true
    },
    {
      label: "未发布",
      value: 'notPublish',
      color: "#409EFF",
      bgColor: "#EFF7FF",
    },
    {
      label: "暂存",
      value: 'temporary',
      color: "#888D95",
      bgColor: "#DEE0E3",
    },
    {
      label: "已下架",
      value: 'delist',
      color: "#F46565",
      bgColor: "#F5CACA",
    },
  ];
  
  export const ruleExecFlagOptions = [
    
    {
      label: "通过",
      value: 'true',
      color: "#70B603",
      bgColor: "#F5FEE6",
    },
    {
      label: "不通过",
      value: 'false',
      color: "#F46565",
      bgColor: "#F5CACA"
    },
    {
      label: "暂停",
      value: 'pause',
      color: "#6E6969",
      bgColor: "#EAE4E4"
    },
    {
      label: "系统异常",
      value: 'error',
      color: "#F46565",
      bgColor: "#DEE0E3",
    }
  ];                              
  export const companyComcodeOptions = [
    {
      label: "四川省分公司",
      value: '2510000000',
    },
    {
      label: "内蒙古分公司",
      value: '2150000000',
    },
    {
      label: "吉林省分公司",
      value: '2220000000',
    },
    {
      label: "陕西省分公司",
      value: '2610000000',
    },
    {
      label: "辽宁省分公司",
      value: '2210000000',
    },
  ];
  export const docStatusOptions = [
    {
      label: "通过",
      value: '1',
      color: "#70B603",
      bgColor: "#F5FEE6",
    },
    {
      label: "不通过",
      value: '2',
      color: "#F46565",
      bgColor: "#F5CACA"
    },
    {
      label: "已撤销",
      value: '3',
      color: "#888D95",
      bgColor: "#DEE0E3",
    }
  ];
  //规则监控状态
  export const ruleExecResultOptions = [
    {
      label: "处理中",
      value: 'running',
      color: "#fff",
      bgColor: "#70B603",
    },
    {
      label: "通过",
      value: 'pass',
      color: "#fff",
      bgColor: "#70B603",
    },
    {
      label: "转人工",
      value: 'noPass',
      color: "#fff",
      bgColor: "#EFC470"
    },
    {
      label: "异常",
      value: 'error',
      color: "#fff",
      bgColor: "#F39393",
    },
    {
      label: "暂停",
      value: 'pause',
      color: "#fff",
      bgColor: "#C0BAAF",
    },
    {
      label: "手动撤回",
      value: 'withdraw',
      color: "#fff",
      bgColor: "#AAAAAA",
    },
  ];
  