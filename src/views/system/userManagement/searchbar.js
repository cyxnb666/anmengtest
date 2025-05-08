import {statusOptions} from '@/config/options'

export default [
  {
    prop: 'userCode',
    type: 'text',
    label: '工号：',
    clearable: true,
    value: ''
  },
  {
    prop: 'username',
    type: 'text',
    label: '姓名：',
    clearable: true,
    value: ''
  },
  /* {
    prop: 'phone',
    type: 'number',
    label: '手机号：',
    clearable: true,
    value: ''
  }, */
   {
    prop: 'organization',
    type: 'org',
    label: '所在机构：',
    optionWidth: '248',
    clearable: true,
    value: []
  }, 
  {
    prop: 'userStatus',
    type: 'select',
    label: '状态：',
    clearable: true,
    options: statusOptions,
    value: ''
  }
]
