import {statusOptions} from '@/config/options'

export default [
  {
    prop: 'roleName',
    type: 'text',
    label: '角色名称：',
    clearable: true,
    value: ''
  },
  {
    prop: 'validStatus',
    type: 'select',
    label: '状态：',
    clearable: true,
    options: statusOptions,
    value: ''
  }
]
