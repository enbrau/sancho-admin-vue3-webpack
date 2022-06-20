<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="undefined" />
    </keep-alive>
  </router-view>
</template>

<style lang="scss">
#app {
  height: 100%;
}
</style>
