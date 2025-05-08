<template>
  <t-dialog
    v-bind="$attrs"
    v-on="$listeners"
    v-model="dialogVisible"
    title="JSON数据"
    :disabled="disabled"
    append-to-body
    :closeOnClickModal="!isSet"
    :footerSlot="!isSet"
    @comfirmBtn="comfirmBtn"
    width="1400px"
    class="json-sta-main"
  >
    <monaco-editor
      :codes.sync="jsonContent"
      types="json"
      ref="monaco"
    ></monaco-editor>
  </t-dialog>
</template>
<script>
export default {
  props: {
    //是否为子级
    isChild: {
      default: false,
    },
    jsonSign: {},
    visible: {},
    disabled: {},
    content: {},
    handlerRow: {
      type: Object,
      default: () => {},
    },
    handlerSign: {
      type: String,
      default: 'add',
    },
  },
  model: {
    prop: 'visible',
    event: 'change',
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      map: {},
      loading: false,
      jsonContent: '',
    }
  },
  computed: {
    isSet({ jsonSign }) {
      return jsonSign == 'set'
    },
  },
  watch: {
    visible: {
      handler(val) {
        this.dialogVisible = val
      },
      immediate: true,
    },
    dialogVisible(val) {
      this.$emit('change', val)
    },
    content: {
      handler(val) {
        this.jsonContent = val
      },
      immediate: true,
    },
  },
  methods: {
    comfirmBtn() {
      try {
        let content = JSON.parse(this.jsonContent)
        if (this.isChild) {
          this.$emit('setRuleJson', content)
        } else {
          this.$bus.$emit('setRuleJson', content)
        }
        this.dialogVisible = false
      } catch (error) {
        this.$message.error('json数据解析错误')
      }
    },
    handlerChangeSign(sign) {
      this.active = sign
    },
    onClose() {
      this.dialogVisible = false
    },
    search(map) {
      this.map = map
      this.pagerConfig.currentPage = 1
      this.loadPage()
    },
    handlerControl() {},
  },
}
</script>
<style scoped lang="scss">
.json-sta-main {
}
</style>
