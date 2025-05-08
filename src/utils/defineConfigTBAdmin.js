/**
 * @author LinXin 2022-07-26
 */
const path = require('path')
const { generateVersion } = require('./utils')

module.exports = function(customConfig = {}, env) {
  const resolve = (dir) => path.join(process.env.INIT_CWD, dir)

  /**
   * TB管理后台独享配置
   * @const {string}  sitename       站点名称
   * @const {boolean} preDeal        是否需要预处理
   * @const {string}  svgIconPath    svg 图标存放路径
   * @const {string}  componentsPath 分包处理时组件存在路径
   * @const {object}  customEnv      自定义环境变量，使用 `VUE_APP_${key}` 访问即可
   *                                 设置示例: customEnv: {BASE_API: '/api', BASE_ICON: './src/assets/icon.svg'}
   *                                 获取变量: process.env.VUE_APP_BASE_API  // 在VUE开发程序中调用设置的BASE_API
   *                                          process.env.VUE_APP_BASE_ICON // 在VUE开发程序中调用设置的BASE_ICON
   */
  const {
    sitename = 'Vue admin Template',
    preDeal = true,
    svgIconPath = resolve('src/icons'),
    componentsPath = resolve('src/components'),
    projectName = null,
    customEnv = null
  } = customConfig.tbAdmminConfig || {}

  // 默认`devServer`配置
  const defaultDevServer = {
    port: 9951,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
  }

  // 默认`chainWebpack`配置
  function defaultChainWebpack(config) {
    // 写入`VUE`环境变量
    config.plugin('define').tap(args => {
      args[0]['process.env'].VUE_APP_TITLE = '"' + sitename + '"'
      args[0]['process.env'].VUE_APP_VERSION = '"' + generateVersion(projectName, env) + '"'

      // 增加自定义`VUE`环境变量
      if (customEnv) {
        for (const key in customEnv) {
          if (Object.hasOwnProperty.call(customEnv, key)) {
            args[0]['process.env'][`VUE_APP_${key}`] = '"' + customEnv[key] + '"'
          }
        }
      }
      return args
    })

    if (preDeal) {
      // 预加载配置
      config.plugin('preload').tap(() => [
        {
          rel: 'preload',
          fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
          include: 'initial'
        }
      ])

      // 关闭预加载模块，加快首屏访问速度
      config.plugins.delete('prefetch')
    }

    if (svgIconPath) {
      // SVG图标导入及生成雪碧图
      config.module.rule('svg').exclude.add(svgIconPath).end()
      config.module
        .rule('icons')
        .test(/\.svg$/)
        .include.add(svgIconPath)
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({
          symbolId: 'icon-[name]'
        })
        .end()
    }

    if (componentsPath) {
      // 构建分包
      config.when(env !== 'development', (config) => {
        config
          .plugin('ScriptExtHtmlWebpackPlugin')
          .after('html')
          .use('script-ext-html-webpack-plugin', [
            {
              inline: /runtime\..*\.js$/
            }
          ])
          .end()

        config.optimization.splitChunks({
          chunks: 'all',
          cacheGroups: {
            libs: {
              name: 'chunk-libs',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              chunks: 'initial'
            },
            elementUI: {
              name: 'chunk-elementUI',
              priority: 20,
              test: /[\\/]node_modules[\\/]_?element-ui(.*)/
            },
            commons: {
              name: 'chunk-commons',
              test: resolve('src/components'),
              minChunks: 3,
              priority: 5,
              reuseExistingChunk: true
            }
          }
        })

        config.optimization.runtimeChunk('single')
      })
    }

    if (customConfig.chainWebpack) {
      customConfig.chainWebpack(config)
    }
  }
  const configureWebpack=customConfig.configureWebpack||{}
  // 默认无需特殊处理的配置
  const defaultConfig = {
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false,
    productionSourceMap: false,
    configureWebpack: { name: sitename,...configureWebpack }
  }

  // 默认配置与自定义配置进行合并
  delete customConfig.tbAdmminConfig
  const config = Object.assign({}, defaultConfig, customConfig)
  config.devServer = Object.assign({}, defaultDevServer, config.devServer)
  config.chainWebpack = defaultChainWebpack

  return config
}
