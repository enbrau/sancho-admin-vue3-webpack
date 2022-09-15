<template>
  <div class="navbar-container">
    <div class="navbar-item" @click="toggleSidebar">
      <svg-icon :icon-class="'hamburger-' + (isSideBarCollapse ? 'on' : 'off')" />
    </div>
    <breadcrumb />
    <div class="right-menu">
      <component :is="$key" v-for="$key in tools" :key="$key" />
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar :class="'user-avatar' + (isCancelImpersonateEnabled ? ' impersonate' : '')">
            <svg-icon v-if="!isCancelImpersonateEnabled" icon-class="male" />
            <svg-icon v-else icon-class="spy" />
          </el-avatar>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="sancho-user-menu">
            <component :is="$key" v-for="$key in actions" :key="$key" />
            <el-divider style="margin: 0px;"></el-divider>
            <el-dropdown-item v-if="showAboutLink">
              <span style="display:block;" @click="showAbout = true">
                <svg-icon icon-class="about" />
                {{ $t('common.about') }}
              </span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span style="display:block;" @click="logout">
                <svg-icon icon-class="exit" />
                {{ $t('common.logout') }}
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <el-dialog v-model="showAbout" :width="320" append-to-body>
    <template #header>
      <svg-icon icon-class="about" />
      {{ $t('common.about') }}
    </template>
    <div style="text-align: center">
      <img :src="logo" style="width: 60%;" /><br>
      <span style="font-size: 12px; font-family: var(--mono-font)">Powered By EBStudio MAF-{{version}}-{{environment}}</span>
    </div>
  </el-dialog>
</template>

<script>
import Breadcrumb from './Breadcrumb.vue'
import tools from './tools.js'
import actions from './actions.js'
import { ElLoading } from 'element-plus'
import packageInfo from '@/../package.json'
import settings from '@/../settings.js'

export default {
  components: { Breadcrumb, ...tools, ...actions },
  data() {
    return {
      tools,
      actions,
      showAbout: false
    }
  },
  computed: {
    showAboutLink() {
      return settings.layout?.showAbout
    },
    logo() {
      return './logo.png'
    },
    version() {
      return packageInfo.version
    },
    environment() {
      return window.__POWERED_BY_QIANKUN__ ? 'S' : 'M'
    },
    isSideBarCollapse() {
      return this.$store.state.app.sidebar === 'collapse'
    }
  },
  methods: {
    toggleSidebar() {
      this.$store.dispatch('app/setSidebarMode', (this.isSideBarCollapse ? '' : 'collapse'))
    },
    async logout() {
      const loading = ElLoading.service({
        lock: true,
        text: this.$t('common.tips.logging_out'),
        background: 'rgba(0, 0, 0, 0.7)',
      })
      try {
        await this.$store.dispatch('subscriber/logout')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } catch(e) {
        loading.close()
      }
    }
  }
}
</script>

<style lang="scss">
.navbar-container {
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 10px;
      margin: 0;
      height: 100%;
      font-size: 18px;
      line-height: var(--sancho-navbar-height);
      vertical-align: text-bottom;

      span {
        display: block;
      }

      &.hover-effect {
        cursor: pointer;
        transition: .3s;
      }

      &:focus {
        background-color: transparent !important;
      }

      &:hover {
        background-color: var(--el-fill-color-light);
      }
    }

    .avatar-container {

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;

           &.impersonate {
             background-color: var(--el-color-danger);
           }
        }

        .el-icon {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.navbar-item {
  display: inline-block;
  padding: 0 10px;
  height: 100%;
  font-size: 18px;
  line-height: var(--sancho-navbar-height);
  vertical-align: text-bottom;
  cursor: pointer;

  &.hover-effect {
    cursor: pointer;
    transition: .3s;
  }
}

.sancho-user-menu {
  .el-dropdown-menu__item {
    span {
      display: block;
      flex-grow: 1;
    }
  }
}
</style>
