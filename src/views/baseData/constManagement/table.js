import { statusOptions, factorClassifyOptions } from '@/config/options';
export default [
  {
    type: 'index',
    width: '70',
    label: '序号'
  },
  {
    prop: 'constantName',
    label: '常量名称'
  },
  {
    prop: 'constantKey',
    label: '常量代码',

  },
  {
    prop: 'constantValue',
    label: "常量值"
  },
  {
    prop: 'constantDesc',
    label: '描述'
  },
  {
    prop: 'createTime',
    label: '创建时间'
  },
  {
    slot:'status',
    prop: 'constantStatus',
    label: '状态',
    options: statusOptions
  }
];
export const handlerBtns = [
  {
    label: '编辑',
    trigger: 'handlerChange',
    sign: 'change'
  },
  {
    slot: 'handlerStatus'
  }
];
