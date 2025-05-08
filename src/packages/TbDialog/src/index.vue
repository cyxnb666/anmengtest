<template>
    <el-dialog
      :visible.sync="dialogVisible"
      :width="width"
      v-bind="$attrs"
      class="tb-dialog-main"
      lock-scroll
      :close-on-click-modal="closeOnClickModal"
      :before-close="beforeClose"
      v-on="$listeners"
    >
      <div slot="title">
        <div v-if="!$slots.title">{{ title }}</div>
        <slot name="title" v-else></slot>
      </div>
  
      <slot />
      <span
        v-if="!footerSlot && (hasConfirmBtn || hasCancelBtn)"
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          v-if="hasConfirmBtn"
          type="primary"
          size="medium"
          :loading="loading"
          :disabled="disabled"
          @click="comfirmBtn"
        >
          {{ confirmText }}
        </el-button>
        <el-button
          v-if="hasCancelBtn"
          class="cancalBtn"
          size="medium"
          :disabled="cancelDisabled"
          @click="closeDialog()"
        >
          {{ cancelText }}
        </el-button>
      </span>
      <span v-else slot="footer" class="dialog-footer">
        <slot name="footer" />
      </span>
    </el-dialog>
  </template>
  <script>
  export default {
    name: 'TDialog',
    model: {
      prop: 'visible',
      event: 'change',
    },
    props: {
      title: {},
      cancelDisabled: {},
      trigger: {
        default: null,
      },
      // 确认按钮禁用
      disabled: {
        type: Boolean,
        default: false,
      },
      // 确定按钮权限码
      permissionCode: {
        type: String,
        default: '',
      },
      // 是否显示
      visible: {
        type: Boolean,
        default: false,
      },
      // 是否点击遮罩层关闭弹框
      closeOnClickModal: {
        type: Boolean,
        default: false,
      },
      width: {
        type: [Number, String],
        default: '70%',
      },
      // 是否需要footer的slot
      footerSlot: {
        type: Boolean,
        default: false,
      },
      // 是否需要确定按钮
      hasConfirmBtn: {
        type: Boolean,
        default: true,
      },
      // 是否需要取消按钮
      hasCancelBtn: {
        type: Boolean,
        default: true,
      },
      confirmText: {
        type: String,
        default: '确定',
      },
      cancelText: {
        type: String,
        default: '取消',
      },
      // 取消时是否确认
      cancelConfirm: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        dialogVisible: false,
      }
    },
    watch: {
      visible: {
        handler(val) {
          this.dialogVisible = val
        },
        immediate: true,
      },
      dialogVisible(val) {
        let trigger = this.trigger || 'change'
        this.$emit(trigger, val)
      },
    },
    mounted() {},
    methods: {
      beforeClose(done) {
        this.closeDialog(done)
      },
      closeDialog(done) {
        if (this.cancelConfirm) {
          this.$confirm('确认关闭窗口?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.closeDialogFn(done)
          })
        } else {
          this.closeDialogFn(done)
        }
      },
      closeDialogFn(done) {
        if (done) {
          done()
        } else {
          this.dialogVisible = false
        }
        this.$emit('cancel')
      },
      // 提交
      comfirmBtn() {
        this.$emit('comfirmBtn', false)
      },
    },
  }
  </script>
  <style scoped lang="scss">
  .tb-dialog-main {
    ::v-deep {
      .el-dialog {
        max-height: 90%;
        overflow: auto;
        margin-top: 10vh !important;
      }
      .el-dialog.is-fullscreen{
        margin-top: 0 !important;
        max-height: 100%;
  
      }
      .el-dialog__header {
        border-bottom: 1px solid #e1e1e1;
      }
      .el-dialog__footer {
        text-align: center;
      }
    }
  }
  </style>
  