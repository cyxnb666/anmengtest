export default {
    data() {
      return {
        isConExecScroll: false,
        delWaiteTime: 10 * 60 * 1000,
        execConTimer: null
      };
    },
    beforeDestroy() {
      this.clearConExecTimer();
    },
    methods: {
      clearConExecTimer() {
        if (this.execConTimer) {
          clearTimeout(this.execConTimer);
          this.execConTimer = null;
        }
      },
      //删除
      checkConIsExec() {
        this.clearConExecTimer();
        this.isConExecScroll = false;
        this.execConTimer = setTimeout(() => {
          if (!this.isConExecScroll && this.execDel) {
            console.log('执行删除');
            this.execDel();
          };
          this.clearConExecTimer();
        }, this.delWaiteTime);
      },
    }
  };