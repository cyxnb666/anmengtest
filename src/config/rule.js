
//比较符
export const opOptions = [
    {
      label: '函数/方法',
      op: 'function',
      value: 'function'
    },
    {
      label: '等于',
      op: '==',
      value: 'eq',
      valueOptions:['const','factor','text'],//值的类型
    },
    {
      label: '不等于',
      op: '!=',
      value: 'unequal',
      valueOptions:['const','factor','text'],//值的类型
    },
    {
      label: '大于',
      op: '>',
      value: 'gt',
      valueOptions:['const','factor','text'],
      valueTextType:'number',//输入值的类型
  
    },
    {
      label: '小于',
      op: '<',
      value: 'lt',
      valueOptions:['const','factor','text'],
      valueTextType:'number'
    },
    {
      label: '大于等于',
      op: '>=',
      value: 'gte',
      valueOptions:['const','factor','text'],
      valueTextType:'number'
  
    },
    {
      label: '小于等于',
      op: '<=',
      value: 'lte',
      valueOptions:['const','factor','text'],
      valueTextType:'number'
    },
    {
      label: '为空',
      value: 'isEmpty',//不要value
      noValue:true
  
    },
    {
      label: '不为空',
      value: 'isNotEmpty',//不要value
      noValue:true
    },
    {
      label: '包含',
      value: 'contain',//数组多选,值常量、因子
      multiple:true,
      valueOptions:['const','factor']
    },
    {
      label: '不包含',
      value: 'noContain',//数组多选,值常量、因子
      multiple:true,
      valueOptions:['const','factor']
    },
    {
      label: '被包含',
      value: 'beContain',//数组多选,值常量、因子
      multiple:true,
      valueOptions:['const','factor']
    },
    {
      label: '不被包含',
      value: 'noBeContain',//数组多选,值常量、因子
      multiple:true,
      valueOptions:['const','factor']
    },
  ];
  // 值的类型
  export const valueTypeOptions=[
    {
      label: '输入值',
      value: 'text',
    },
    {
      label: '常量',
      value: 'const',
    },
    {
      label: '布尔值',
      value: 'bool',//大于、小于、大于等于、小于等于不能选布尔值
    },
    {
      label: '因子',
      value: 'factor',
    },
    {
      label: '无参数',
      value: 'noRightValue',
      noRightValue:true
    },
  
    {
      label: '有',
      value: 'hasVal',
      noRightValue:true
    },
    {
      label: '是',
      value: 'isVal',
      noRightValue:true
    },
    {
      label: '否',
      value: 'noVal',
      noRightValue:true
    },
  ]
  //条件动作
  export const actionOptions=[
    {
      label: '查询延期单证',
      value: 'delay',
    },
  ]
  export const leftOptions=[]