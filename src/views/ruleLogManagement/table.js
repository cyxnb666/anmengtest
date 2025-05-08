export default [
  {
    type: 'index',
    width: '60',
    label: '序号'
  },
  {
    prop: 'busiNo',
    label: '投保单号',
    minWidth: 180
  },
  {
    prop: 'comName',
    label: '保单机构',
    minWidth: 180
  },
  // {
  //   slot: 'comCode',
  //   label: '保单机构',
  //   minWidth: 150,
  //   byParent: 'org',
  //   defaultProps: {
  //     value: 'comCode',
  //     label: 'comName'
  //   }
  // },
  {
    prop: 'classesName',
    label: '险类',
    width: 100
  },
  {
    prop: 'riskName',
    label: '险种',
    minWidth: 120,
    // byParent: 'riskOptions',
    // defaultProps: {
    //   label: "riskName",
    //   value: "riskCode"
    // }
  },
  {
    slot: 'executeResult',
    label: '核保结果',
    width: 100
  },
  {
    prop: 'username',
    label: '提交人',
    width: 100
  },
  {
    prop: 'createTime',
    label: '提交时间', 
    width: 160,
    formatFn: ({ cellValue }) => {
      return cellValue ? cellValue.substring(0, 19).replace('T', ' ') : '';
    }
  },
  {
    prop: 'ruleExecEndTime',
    label: '完成时间',
    width: 160,
    formatFn: ({ cellValue }) => {
      return cellValue ? cellValue.substring(0, 19).replace('T', ' ') : '';
    }
  }
]

export const handlerBtns = [
  {
    label: '查看核保详情',
    slot: 'handlerDetails'
  }
]