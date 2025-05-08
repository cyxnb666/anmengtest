<template>
  <t-dialog
    v-bind="$attrs"
    v-on="$listeners"
    v-model="dialogVisible"
    :title="title"
    append-to-body
    @comfirmBtn="handlerSubmitPublic"
    width="400px"
    :loading="loading"
    class="json-sta-main"
  >
    <div class="flex-v code-line">
      <el-input
        v-model="verifyCode"
        clearable
        size="small"
        maxlength="6"
        placeholder="请输入验证码"
        class="code-input"
      ></el-input>
      <code-btn
        @sendCode="sendCode"
        ref="codeBtn"
        size="small"
        :isCustomSend="true"
      ></code-btn>
    </div>
  </t-dialog>
</template>
<script>
export default {
  props: {
    title: {
      default: '确认发布',
    },
    visible: {},
    disabled: {},
    loading: {},
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
      verifyCode: '',
    }
  },
  computed: {},
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
  },
  methods: {
    sendCode() {
      getCode({ orderNo: this.handlerCodeRow.productCode }).then((res) => {
        if (res.code === 200) {
          this.$message.success('发送成功')
          this.$refs.codeBtn.beginCountDown()
        }
      })
    },
    handlerSubmitPublic() {
      if (!this.verifyCode) {
        return this.$message.error('验证码不能为空')
      }
      this.$emit('handlerPublish', this.verifyCode)
    },
  },
}
</script>
<style scoped lang="scss">
.json-sta-main {
  .code-input {
    margin-right: 20px;
  }
}
</style>
