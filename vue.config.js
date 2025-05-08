const defineConfigTBAdmin = require('./src/utils/defineConfigTBAdmin');
const { sitename, ENV } = require('./src/settings');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const MonacoLocalesPlugin = require('monaco-editor-locales-plugin');
module.exports = defineConfigTBAdmin({
  /**
   * 额外可配置参数:
   * @param {object} tbAdmminConfig 管理后台独享配置 {
   *    @param {string}  sitename       站点名称
   *    @param {boolean} preDeal        是否需要预处理
   *    @param {string}  svgIconPath    svg 图标存放路径
   *    @param {string}  componentsPath 分包处理时组件存在路径
   * }
   */
  tbAdmminConfig: { sitename },

  productionSourceMap: false,
  outputDir: ENV === 'test' ? 'dist-automation-test' : 'dist-automation-prod',
  configureWebpack: {
    entry: {
      'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js'
    },
    plugins: [
      new MonacoWebpackPlugin({
        languages: ["json", "xml", "yaml", "python", 'java', 'javascript']
      }),
      new MonacoLocalesPlugin({
        //设置支持的语言
        languages: ["es", "zh-cn"],
        //默认语言
        defaultLanguage: "zh-cn",
        //打印不匹配的文本
        logUnmatched: false,
        //自定义文本翻译
        mapLanguages: { "zh-cn": { "Peek References": "查找引用", "Go to Symbol...": "跳到变量位置", "Command Palette": "命令面板" } }
      })
    ]
  },
  chainWebpack(config) {
    config.plugins.delete('preload'); // TODO: need test
    config.plugins.delete('prefetch'); // TODO: need test

  },
  css: {
    // css预设器配置项
    loaderOptions: {
      scss: {
        /*sass-loader 8.0语法 */
        prependData: '@import "~@/styles/variables.scss";'
      },
    }
  },
  devServer: {
    port: 9961,
    open: true,
    proxy: {
      '^/liumingjin': {
        target: 'http://10.255.76.39:8001',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/liumingjin': '' }
      },
    }
  }
}, process.env.NODE_ENV);