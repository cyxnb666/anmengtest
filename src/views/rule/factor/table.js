import {statusOptions,factorClassifyOptions} from '@/config/options'
export default [
  {
    type: 'index',
    width: '70',
    label: '序号'
  },
  {
    prop: 'divisorName',
    label: '因子名称'
  },
  {
    prop:'divisorCode',
    label:'因子代码'
  },
  {
    prop: 'divisorType',
    label: '因子分类',
    options:factorClassifyOptions

  },
 
  {
    prop: 'createdBy',
    label: '创建人'
  },
  {
    prop: 'createTime',
    label: '创建时间'
  },
  {
    prop: 'updateTime',
    label: '更新时间'
  },
  {
    slot: 'status',
    label: '状态',
    options:statusOptions
  }
]
export const handlerBtns = [
  {
    label: '编辑',
    trigger: 'handlerChange',
    sign: 'change'
  },
  {
    slot: 'handlerStatus',
  },
  {
    slot: 'del',
  },
]
