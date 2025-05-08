export default {
    data() {
      return {
        scale: this.getScale(),
        designWidth: 1920,
        designHeight: 1080
      };
    },
    mounted() {
      window.addEventListener('resize', this.setScale);
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', this.setScale);
      });
    },
    computed: {
      scaleStyle({ scale }) {
        if(this.isDev&&this.isNoSace){
          return {}
        }
        return {
          transform: `scale(${scale}) translate(-50%, -50%)`,
          width: '1920px',
          height: '1080px',
          transformOrigin: "0 0",
          position: "absolute",
          left: "50%",
          top: "50%",
          transition: "0.3s",
        };
      },
    },
    methods: {
      setScale() {
        this.scale = this.getScale();
      },
      getScale() {
        // 固定好16:9的宽高比，计算出最合适的缩放比，宽高比可根据需要自行更改
        const width = 1920,
          height = 1080;
        let ww = window.innerWidth / width;
        let wh = window.innerHeight / height;
        return ww < wh ? ww : wh;
      },
    },
  };