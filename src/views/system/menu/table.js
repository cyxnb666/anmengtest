export default [
    {
      type: 'index',
      label: '序号',
      width: '70'
    },
    {
      prop: 'name',
      label: '角色名'
    },
    {
      prop: 'description',
      label: '描述'
    }
  ]
  export const handlerBtns = [
    {
      label: '更改',
      trigger: 'handlerRole',
      sign: 'change'
    },
    {
      label: '删除',
      trigger: 'deleteRole'
    }
  ]
  