export default [
    {
      prop: 'username',
      type: 'text',
      label: '请输入用户名',
      clearable: true,
      value: ''
    },
    {
      prop: 'phone',
      type: 'number',
      label: '请输入手机号码',
      clearable: true,
      value: ''
    }, {
      prop: 'organization',
      type: 'select',
      label: '请选择所在机构',
      clearable: true,
      options: [],
      value: ''
    }, {
      prop: 'username',
      type: 'select',
      label: '请选择用户状态',
      clearable: true,
      options: [],
      value: ''
    }, {
      prop: 'periodOfValidity',
      type: 'daterange',
      label: '有效期',
      startPlaceholder: '有效期开始',
      endPlaceholder: '有效期结束',
      value: []
    }
  ]
  