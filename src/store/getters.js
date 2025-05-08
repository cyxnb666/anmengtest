const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    userInfo: state => state.user.userInfo,
    name: state => state.user.name,
    firstPath: state => state.permission.firstPath,
    permission_routes: state => state.permission.routes,
    funtionIdList:state=>state.permission.funtionIdList
  }
  export default getters
  