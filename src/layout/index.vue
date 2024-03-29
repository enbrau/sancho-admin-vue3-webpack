<template>
  <div v-if="!isMicroApp" class="app-wrapper" :class="appStatus">
    <side-bar />
    <div class="view-container">
      <div class="view-head">
        <nav-bar />
        <tag-bar v-if="showTags" />
      </div>
      <div class="view-body" :style="{ height: viewBodyHeight }">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="decideComponent(Component)" :key="$route.path"  />
          </keep-alive>
        </router-view>
        <div id="sancho-subapp-container"></div>
      </div>
    </div>
  </div>
  <router-view v-else v-slot="{ Component }">
    <keep-alive>
      <component :is="decideComponent(Component)" :key="undefined"  />
    </keep-alive>
  </router-view>
</template>

<script>
import NavBar from './components/NavBar/index.vue'
import SideBar from './components/SideBar/index.vue'
import TagBar from './components/TagBar/index.vue'
import { markRaw } from '@vue/reactivity'
import settings from '@/../settings.js'
import { hasPermission } from '@/router'
import Page403 from '@/views/error/403.vue'

export default {
  components: { SideBar, NavBar, TagBar },
  computed: {
    showTags() {
      return settings.layout.showTags
    },
    appStatus() {
      return {
        'sidebar-collapse': this.$store.state.app.sidebar === 'collapse'
      }
    },
    viewBodyHeight() {
      return this.isMicroApp ? '100%' : (this.$store.state.app.windowInnerHeight - 50 - (settings.layout.showTags ? 32 : 0)) + 'px'
    },
    isMicroApp() {
      return window.__POWERED_BY_QIANKUN__
    }
  },
  methods: {
    decideComponent(component) {
      // 权限判断
      const route = this.$route.matched[this.$route.matched.length - 1]
      if (!hasPermission(route)) {
        return markRaw(Page403)
      }
      // 解决嵌套路由问题
      if (settings.useNestedRoute || (this.$route.meta && !this.$route.meta.nested)) {
        return markRaw(this.$route.matched[this.$route.matched.length - 1].components.default)
      } else {
        return component
      }
    }
  }
}
</script>

<style lang="scss">
body {
  overflow: hidden;
}

.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;

  .sidebar-container {
    transition: width 0.28s;
    width: var(--sancho-sidebar-width);
    position: fixed;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
  }

  .view-container {
    min-height: 100%;
    transition: margin-left 0.28s;
    margin-left: var(--sancho-sidebar-width);
    position: relative;
    background-color: var(--el-bg-color-page);

    .view-head {
      .navbar-container {
        height: var(--sancho-navbar-height);
      }
      .tagbar-container {
        height: var(--sancho-tagbar-height);
      }
    }

    .view-body {
      background-color: var(--el-bg-color-overlay);
      border-radius: 0px;
      margin-right: 0px;
      overflow: auto;
    }
  }

  &.sidebar-collapse {
    .sidebar-container {
      width: var(--sancho-sidebar-width-collapse);
    }

    .view-container {
      margin-left: var(--sancho-sidebar-width-collapse);
    }
  }

  .view-body {
    overflow: auto;
    position: relative;

    .view-body-wrapper {
      padding: 0px;

      &.bordered {
        border-top: 1px solid var(--el-border-color);
        border-left: 1px solid var(--el-border-color);
      }

      &.adapt-height {
        overflow: hidden;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }

      &.with-padding {
        padding: 15px;
      }
    }
  }
}

.mobile {
  .main-container {
    margin-left: 0px;
  }
}
</style>
