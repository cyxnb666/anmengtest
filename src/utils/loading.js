import { Loading } from "element-ui";
class CommonLoading {
  constructor() {
    this.loading = null
    this.needLoadingRequestCount = 0
  }
  startLoading() {
    this.loading = Loading.service({
      lock: true,
      background: 'rgba(255,255,255,0.5)',
      fullscreen: true,
    })
  }
  endLoading() {
    if (this.loading) this.loading.close()
  }
  showFullScreenLoading() {
    if (this.needLoadingRequestCount === 0) {
      this.startLoading()
    }
    this.needLoadingRequestCount++
  }
  tryHideFullScreenLoading() {
    if (this.needLoadingRequestCount <= 0) return
    this.needLoadingRequestCount--
    if (this.needLoadingRequestCount === 0) {
      this.endLoading()
    }
  }
}
export default CommonLoading