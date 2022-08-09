<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="undefined" />
    </keep-alive>
  </router-view>
</template>

<script>
import actions from '@/store/actions.js'

export default {
  // watch: {
  //   '$store.state': {
  //     handler: 'updateGlobalActions',
  //     deep: true
  //   }
  // },
  mounted() {
    actions.onGlobalStateChange((state) => {
      console.log('[Sancho][MicroApp] Main App state changed: ', state)
      this.$store.dispatch('app/setState', state.app)
      this.$store.dispatch('subscriber/setState', state.subscriber)
      this.$store.dispatch('microApps/setState', state.microApps)
    }, true)
  },
  methods: {
    updateGlobalActions() {
      actions.setGlobalState(this.$store.state)
    }
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
