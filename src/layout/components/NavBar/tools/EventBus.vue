<template>
  <el-button class="right-menu-item hover-effect" :title="`消息总线链接${connected ? '正常' : '断开'}`" text trigger="click">
    <svg-icon v-if="connected" icon-class="event-bus" />
    <svg-icon v-else icon-class="event-bus-disconnected" style="color: var(--el-color-danger)" />
  </el-button>
</template>

<script>
export default {
  data() {
    return {
      loading: false
    }
  },
  computed: {
    connected() {
      return this.$store.state.bus.readyState === 1
    }
  },
  watch: {
    '$store.state.bus.readyState': {
      handler: 'handleBusState'
    }
  },
  mounted() {
    this.$EventBus.init()
  },
  methods: {
    handleBusState() {
      const that = this
      switch(this.$store.state.bus.readyState) {
        case 0:
          this.loading = true
          break
        case 1:
          this.loading = false
          this.$notify({
            title: '消息总线',
            message: '成功创建连接到服务器消息总线！',
            type: 'success',
            position: 'bottom-right'
          })
          break
        case 2:
          this.loading = true
          break
        case 3:
          this.loading = true
          this.$notify({
            title: '消息总线',
            message: '消息总线链接已断开！\n10秒后将自动尝试重连',
            type: 'error',
            position: 'bottom-right',
            duration: 10000
          })
          setTimeout(function() {
            that.$EventBus.init()
          }, 10000)
          break
      }
    }
  }
}
</script>
