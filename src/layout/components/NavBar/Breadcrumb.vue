<template>
  <el-breadcrumb
    class="app-breadcrumb"
    separator="/"
  >
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item,index) in levelList"
        :key="item.path"
      >
        <span
          v-if="item.redirect==='noRedirect'||index==levelList.length-1"
          class="no-redirect"
        >{{ $t(item.meta.title) }}</span>
        <a
          v-else
          @click.prevent="handleLink(item)"
        >{{ $t(item.meta.title) }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      const { params } = this.$route
      let matched = this.$route.matched.filter(item => {
        if (item.meta && item.meta.title) {
          // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
          var toPath = pathToRegexp.compile(item.path)
          item.path = toPath(params)
          return true
        }
      })
      const first = matched[0]
      if (!this.isRootRoute(first)) {
        matched = [{ path: '/dashboard', meta: { title: 'common.menus.Dashboard' }}].concat(matched)
      }

      this.levelList = matched.filter(item => item.meta && item.meta.title !== false)
    },
    isRootRoute(route) {
      const name = route && route.meta && route.meta.title ? route.meta.title : ''
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'common.menus.dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: var(--sancho-navbar-height);
  margin-left: 8px;
  vertical-align: bottom;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
