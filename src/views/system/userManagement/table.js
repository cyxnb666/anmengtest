import { statusOptions } from '@/config/options';

export default [
  {
    type: 'index',
    width: 50,
    label: '序号'
  },
  {
    prop: 'userCode',
    label: '工号'
  },
  {
    prop: 'username',
    label: '姓名'
  },
  {
    prop: 'mechanism',
    label: '所属机构'
  },
  {
    prop: 'roleName',
    splitSign: '、',
    label: '拥有角色'
  },
  /*  {
     slot: 'userPhone',
     label: '手机号'
   }, */
  {
    prop: 'userEmail',
    label: '邮箱'
  },
  {
    slot: 'status',
    prop: 'userStatus',
    label: '状态',
    options: statusOptions
  }
];
export const handlerBtns = [
  {
    label: '分配角色',
    trigger: 'handlerChange',
    sign: 'addUserRole'
  },
  /*  {
     label: '重置密码',
     trigger: 'handlerRestPwd'
   }, */
  {
    label: '启用',
    slot: 'handlerStatus',
  },
];
