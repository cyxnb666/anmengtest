<template>
    <div class="monaco-editor-box">
      <div id="monaco-editor" ref="monacoEditor" class="monaco-editor" />
    </div>
  </template>
  
  <script>
  import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
  export default {
    name: 'MonacoEditor',
    components: {},
    props: {
      // 编辑器支持的文本格式,自行在百度上搜索
      types: {
        type: String,
        default: 'javascript',
      },
      // 名称
      name: {
        type: String,
        default: 'test',
      },
      readOnly: {
        type: Boolean,
        default: false,
      },
      editorOptions: {
        type: Object,
        default: function () {
          return {}
        },
      },
      codes: {
        type: String,
        default: function () {
          return ''
        },
      },
    },
    data() {
      return {
        initOptions: {
          folding: true, // 是否折叠
          foldingHighlight: true, // 折叠等高线
          selectOnLineNumbers: true,
          roundedSelection: false,
          writeOnly: false,
          colorDecorators: true,
          cursorStyle: 'line', //光标样式
          automaticLayout: true, //自动布局
          glyphMargin: true, //字形边缘
          useTabStops: false,
          fontSize: 30, //字体大小
          autoIndent: true, //自动布局
        },
        editor: null, //文本编辑器
        isSave: true, //文件改动状态，是否保存
        codeValue: null, //保存后的文本
      }
    },
    watch: {
      codes: {
        handler(newValue) {
          this.$nextTick(() => {
            if (!this.editor) this.initEditor(newValue)
          })
          this.$nextTick(() => {
            if (this.editor) {
              if (newValue !== this.editor.getValue()) {
                this.editor.setValue(newValue)
                setTimeout(() => {
                  this.editor.trigger('anyString', 'editor.action.formatDocument')
                }, 200)
              }
            }
          })
        },
        immediate: true,
      },
    },
    mounted() {
      // this.initEditor()
    },
    beforeDestroy() {
      if (this.editor) {
        this.editor.dispose()
      }
    },
    methods: {
      initEditor() {
        const self = this
        // 初始化编辑器，确保dom已经渲染
        this.editor = monaco.editor.create(self.$refs.monacoEditor, {
          value: null, // 编辑器初始显示内容
          language: self.types, // 支持语言
          theme: 'vs', // 主题
          selectOnLineNumbers: true, //显示行号
          readOnly: self.readOnly,
          automaticLayout: true,
          editorOptions: { ...self.initOptions, ...self.editorOptions },
        })
        // self.$emit("onMounted", self.editor); //编辑器创建完成回调
        self.editor.onDidChangeModelContent(function (event) {
          //编辑器内容changge事件
          self.codesCopy = self.editor.getValue()
          self.$emit('update:codes', self.editor.getValue())
          self.$emit('onCodeChange', self.editor.getValue(), event)
        })
      },
    },
  }
  </script>
  
  <style scoped lang="scss">
  .monaco-editor-box {
    height: 400px;
    .monaco-editor {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: 1px solid #ccc;
      & > div {
        box-sizing: border-box;
      }
    }
  }
  </style>
  