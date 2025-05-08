export default [
  {
    type: 'index',
    width: '70',
    label: '序号'
  },
  {
    prop: 'configId',  
    label: '配置ID',
    width: 120
  },
  {
    slot: 'comCode',
    label: '机构',
    byParent: 'org', 
    sliceNum: 7,
    defaultProps: {
      value: 'comCode',
      label: 'comName'
    }
  },
  {
    prop: 'riskCode',
    label: '险种',
    byParent: 'riskOptions',
    defaultProps: {
      label: "riskName",
      value: "riskCode" 
    }
  },
  {
    prop: 'targetClassify',
    label: '标的唯一标识',
    formatFn: ({ cellValue }) => {
      const map = {
        'earTag': '耳标照',
        'DPYSSM': '大棚钥匙锁码'
      };
      return map[cellValue] || cellValue;
    }
  },
  {
    slot: 'status',
    label: '状态',
    width: 90
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180,
    formatFn: ({ cellValue }) => {
      return cellValue ? cellValue.substring(0, 19).replace('T', ' ') : '';
    }
  },
  {
    prop: 'updateTime',
    label: '更新时间', 
    width: 180,
    formatFn: ({ cellValue }) => {
      return cellValue ? cellValue.substring(0, 19).replace('T', ' ') : '';
    }
  }
]

export const handlerBtns = [
  {
    label: '查看',
    trigger: 'handlerChange', 
    sign: 'view',
  },
  {
    label: '发布',
    slot: 'handlerRelease',
  },
  {
    label: '编辑',
    slot: 'handlerChange',
  },
  {
    label: '下架',
    slot: 'handlerDelist',
  },
  {
    label: '删除',
    slot: 'del',
  }
]