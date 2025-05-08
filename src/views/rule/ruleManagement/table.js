
import {ruleNodeOptions} from '@/config/options'

export default [
  {
    type: 'index',
    width: '70',
    label: '序号'
  },
  {
    prop: 'ruleName',
    label: '规则名称',
    width:200
  },
  {
    prop: 'ruleNode',
    label: '规则节点',
    width:80,
    options:ruleNodeOptions

  },
  {
    prop: 'riskCode',
    label: '险种',
    byParent:'riskOptions',
    defaultProps:{
      label:"riskName",
      value:"riskCode"
    }
  },
  {
    slot: 'comCode',
    label: '规则所属机构',
    byParent:'org',
    sliceNum:7,
    defaultProps:{
      value:'comCode',
      label:'comName',
    }
  },
  {
    prop: 'createdBy',
    width:100,
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
    slot: 'ruleVersion',
    label: '运行版本号'
  },
  {
    slot: 'status',
    label: '状态'
  },
  {
    prop: 'ruleDesc',
    label: '描述'
  },
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
    label: '复制',
    trigger: 'handlerCopy',
  },
  {
    label: '历史版本',
    slot: 'version',
  },
  {
    label: '规则监控',
    slot: 'monitoring',
  },
  {
    label: '删除',
    slot: 'del',
  },
]
