const ENV=process.env.VUE_APP_BASE_ENV
module.exports = {
  // 仅开发环境才能使用的权限
  defaultPwd: 'tb123456',
  sitename: '农险自动化',
  ENV,
  isDev:ENV==='development',
  /**
   * @type {boolean} true | false
   * @description 是否固定标题
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description 是否在侧边栏中显示LOGO
   */
  sidebarLogo: true,

  /**
   * @type {string[]}
   * @description 用户登录鉴权白名单，即为无需登录鉴权的路由
   */
  whiteList: ['/login', '/ruleLogManagement/logDetails'],
  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: false,

  /**
    * @type {boolean} true | false
    * @description Whether need tagsView
    */
  tagsView: true,
  tokenCookieExpires: 1,
  TokenKey:'AUTO_TOKEN',
  timeout:2*60*1000
}
