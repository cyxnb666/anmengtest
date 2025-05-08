<script>
// 进来迅速判断第一个页面
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/storage'
export default {
  computed: {
    ...mapGetters([
      'permission_routes'
    ])
  },
  watch: {
    permission_routes: {
      immediate: true,
      handler(val) {
        // 没有token 回到登录页
        const token = getToken()
        if (!token) return this.$router.replace({ path: '/login' })
        this.getRoute()
      }
    }
  },
  methods: {
    getRoute() {
      const _routes = this.permission_routes || []
      for (let i = 0; i < _routes.length; i++) {
        const item = _routes[i]
        if (item.hidden) continue
        const _children = item.children || []
        if (!_children.length) continue
        for (let j = 0; j < _children.length; j++) {
          const it = _children[j]
          if (!it.hidden) return this.toPage(it)
        }
      }
    },
    toPage(routeInfo) {
      const routeName = routeInfo.name
      this.$router.replace({ name: routeName })
    }
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>

<style lang="scss" scoped>

</style>
