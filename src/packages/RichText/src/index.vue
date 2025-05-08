<template>
    <div
      ref="editor"
      :class="{ 'rich-text-main': true, 'rich-text-main-disabled': disabled }"
    ></div>
  </template>
  <script>
  import E from 'wangeditor'
  import { getToken } from '@/utils/auth'
  
  export default {
    name: 'RichText',
    props: {
      content: {
        type: String,
        default: '',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    mounted() {
      this.openRichTxt()
    },
    data() {
      return { phoneEditor: null }
    },
    watch: {
      disabled: {
        handler(val) {
          this.$nextTick(() => {
            this.setDisabled(val)
          })
        },
        immediate: true,
      },
      content: {
        handler(val) {
          this.$nextTick(() => {
            if (!this.phoneEditor) {
              this.openRichTxt(val)
            } else if (val != this.phoneEditor.txt.html()) {
              this.setValue(val)
            }
          })
        },
        immediate: true,
      },
    },
    mounted() {
      this.openRichTxt()
    },
    methods: {
      setValue(value = '') {
        if (this.phoneEditor) {
          this.phoneEditor.txt.html(value)
        }
      },
      setDisabled(val) {
        if (this.phoneEditor)
          this.phoneEditor.$textElem.attr('contenteditable', !val)
      },
      openRichTxt(value = '') {
        if (!this.$refs.editor || this.phoneEditor) return
        this.phoneEditor = new E(this.$refs.editor)
        const _this = this
        this.phoneEditor.config.showLinkImg = false // 关闭网络路径图片方式
        this.phoneEditor.config.uploadImgServer = `${this.commonAddress}applets/product/uploadImg` // 上传图片的接口地址
        this.phoneEditor.config.uploadFileName = 'nfile' // formdata中的name属性
        this.phoneEditor.config.showFullScreen = false
        var userInfo = getToken()
  
        this.phoneEditor.config.uploadImgHeaders = {
          headers: {
            'Content-Type': 'multipart/form-data',
            token: userInfo.token,
            userCode: userInfo.userCode,
          }, // 设置请求头
        }
        this.phoneEditor.config.debug = true
  
        // 上传视频
        this.phoneEditor.config.customUploadVideo = function (
          resultFiles,
          insertVideoFn,
        ) {
          // resultFiles 是 input 中选中的文件列表
          // insertVideoFn 是获取视频 url 后，插入到编辑器的方法
          resultFiles.forEach(async function (item) {
            const formData = new FormData()
            formData.append('file', item)
            formData.append('imgType', 'tbyd')
            const res = await _this.request({
              url: `/applets/product/uploadImg`,
              method: 'post',
              data: formData,
              baseURL: _this.commonAddress,
              headers: {
                'Content-Type': 'multipart/form-data',
                token: userInfo.token,
                userCode: userInfo.userCode,
              },
            })
            console.log(res)
            const baseUrl = _this.fileviewUrl
            insertVideoFn(baseUrl + res.data.fileViewUrl + '&ShowType=file')
            // debugger
          })
  
          // 上传视频，返回结果，将视频地址插入到编辑器中
        }
        // 上传文件
        this.phoneEditor.config.customUploadImg = function (
          resultFiles,
          insertImgFn,
        ) {
          // resultFiles 是 input 中选中的文件列表
          // insertImgFn 是获取图片 url 后，插入到编辑器的方法
          resultFiles.forEach(async function (item) {
            console.log(item)
            const formData = new FormData()
            formData.append('file', item)
            formData.append('imgType', 'tbyd')
            const res = await _this.request({
              url: `/applets/product/uploadImg`,
              method: 'post',
              data: formData,
              baseURL: _this.commonAddress,
              headers: {
                'Content-Type': 'multipart/form-data',
                token: userInfo.token,
                userCode: userInfo.userCode,
              },
            })
            console.log(res)
            const baseUrl = _this.fileviewUrl
            insertImgFn(baseUrl + res.data.fileViewUrl)
          })
        }
  
        this.phoneEditor.config.uploadImgHooks = {
          // 图片上传并返回结果，但图片插入错误时触发
          fail: function (xhr, editor, result) {
            alert('错误了吗')
            console.log(result)
          },
          success: function (xhr, editor, result) {
            // 图片上传并返回结果，图片插入成功之后触发
            console.log(result.data.url, 'success')
          },
        }
  
        // 创建一个富文本编辑器
        this.phoneEditor.create()
        this.phoneEditor.config.onchange = function (newHtml) {
          this.$emit('update:content', newHtml)
        }.bind(this)
  
        // 富文本内容
        this.phoneEditor.txt.html(value)
      },
    },
  }
  </script>
  <style scoped lang="scss">
  .rich-text-main-disabled {
    ::v-deep {
      & > .w-e-toolbar {
        position: relative;
        &::before {
          content: '';
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 99999;
          position: absolute;
          cursor: not-allowed;
        }
      }
      & > div {
        background: #f5f7fa !important;
        color: #c0c4cc !important;
      }
    }
  }
  </style>
  