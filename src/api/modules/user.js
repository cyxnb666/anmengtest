import request from '@/utils/request.js';




// ++++++++++++++用户+++++++++++++++
//获取用户
export function getUserList(data={}) {
  return request({
    url: '/user-info/page',
    data,
    method: 'post'
  })
}
//分配角色
export function assignRole(data={}) {
  return request({
    url: '/user-info/assign',
    data,
    method: 'post'
  })
}
//重置密码
export function resetPassword(data={}) {
  return request({
    url: '/user-info/resetPassword',
    data,
    method: 'post'
  })
}
//查询当前用户绑定的角色
export function selectRoleByUser(data={}) {
  return request({
    url: '/user-info/selectRoleByUser',
    data,
    method: 'post'
  })
}
//启用/禁用
export function updateUserStatus(data={}) {
  return request({
    url: '/user-info/updateStatus',
    data,
    method: 'post'
  })
}
//获取用户选择角色
export function assignPage(data={}) {
  return request({
    url: '/user-info/assignPage',
    data,
    method: 'post'
  })
}

//查询用户信息
export function selectUserInfo(data={}) {
  return request({
    url: '/user-info/selectUserInfo',
    data,
    method: 'post'
  })
}

//根据机构查询用户
export function initUserInfo(data={}) {
  return request({
    url: '/user-info/initUserInfo',
    data,
    method: 'post'
  })
}


// +++++++++++++++角色++++++++++++++++++++++
//新增角色
export function addRole(data={}) {
  return request({
    url: '/role-info/addRole',
    data,
    method: 'post'
  })
}
//删除角色
export function deleteRole(data={}) {
  return request({
    url: '/role-info/deleteRole',
    data,
    method: 'post'
  })
}
//角色添加用户
export function addUser(data={}) {
  return request({
    url: '/role-info/addUser',
    data,
    method: 'post'
  })
}
//分页查询角色
export function pageRole(data={}) {
  return request({
    url: '/role-info/pageRole',
    data,
    method: 'post'
  })
}
//查询当前角色绑定用户
export function selectUserByRole(data={}) {
  return request({
    url: '/role-info/selectUserByRoleId',
    data,
    method: 'post'
  })
}
//角色绑定用户查询用户列表
export function selectUser(data={}) {
  return request({
    url: '/role-info/selectUser',
    data,
    method: 'post'
  })
}
//编辑角色
export function updateRole(data={}) {
  return request({
    url: '/role-info/updateRole',
    data,
    method: 'post'
  })
}
//查询当前角色绑定用户
export function updateStatus(data={}) {
  return request({
    url: '/role-info/updateStatus',
    data,
    method: 'post'
  })
}



// ++++++++++++菜单++++++++++++
//查询所有菜单
export function allMenu(data={}) {
  return request({
    url: '/sys-menu/allMenu',
    data,
    method: 'post'
  })
}
//绑定菜单
export function bandMenu(data={}) {
  return request({
    url: '/sys-menu/bandMenu',
    data,
    method: 'post'
  })
}
//根据角色获取菜单
export function getTreeByRole(data={}) {
  return request({
    url: '/sys-menu/getTreeByRole',
    data,
    method: 'post'
  })
}
//查询角色绑定的菜单列表
export function selectMenuByRole(data={}) {
  return request({
    url: '/sys-menu/selectMenuByRole',
    data,
    method: 'post'
  })
}
//新增菜单
export function addMenu(data={}) {
  return request({
    url: '/sys-menu/addMenu',
    data,
    method: 'post'
  })
}
//编辑菜单
export function updateMenu(data={}) {
  return request({
    url: '/sys-menu/updateMenu',
    data,
    method: 'post'
  })
}
//删除菜单
export function deleteMenu(data={}) {
  return request({
    url: '/sys-menu/deleteMenu',
    data,
    method: 'post'
  })
}

