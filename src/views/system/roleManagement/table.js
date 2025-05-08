import {statusOptions} from '@/config/options'

export default [
  /* {
    type: 'index',
    width: '70',
    label: '序号'
  }, */
  {
    prop: 'id',
    label: '角色编码'
  },
  {
    prop: 'roleName',
    label: '角色名称'
  },
  {
    slot:'status',
    prop: 'validStatus',
    label: '角色状态',
    options:statusOptions
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
    label: '修改时间'
  },
 
]
export const handlerBtns = [
  {
    label: '启用',
    slot: 'handlerStatus',
  },
  {
    label: '编辑',
    trigger: 'handlerChange',
    sign: 'change'
  },
  {
    label: '添加用户',
    trigger: 'handlerChange',
    sign: 'addRoleUser'
  },
  {
    label: '菜单权限',
    trigger: 'handlerChange',
    sign: 'addMenu'
  },
  {
    label: '删除',
    slot: 'handlerDel'
  }
]
