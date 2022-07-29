<template>
  <div v-show="app || alwaysShow" :id="id" :style="{ width, height, position: 'relative' }">
    <el-empty v-if="msg" :description="msg" />
  </div>
</template>

<script>
import { uuid } from '@/utils'
import { loadMicroApp } from 'qiankun'

export default {
  props: {
    appKey: {
      type: String,
      required: true
    },
    minAppVersion: {
      type: String,
      default: ''
    },
    routePath: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    alwaysShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      id: null,
      app: null,
      msg: ''
    }
  },
  mounted() {
    this.id = this.appKey + '-' + uuid()
    setTimeout(() => {
      this.loadApp()
    }, 1000)
  },
  methods: {
    loadApp() {
      if (!this.app) {
        this.app = (function(apps, appKey) {
          for (const app of apps) {
            if (app.key === appKey) {
              return app
            }
            return null
          }
        })(this.$store.state.microApps.apps, this.appKey)
      }

      this.msg = ''

      if (!this.app) {
        this.msg = `${this.app.name} is not installed!`
        return
      }

      let valid = true
      if (this.minAppVersion) {
        const v_target = this.app.version.split('.')
        const v_min    = this.minAppVersion.split('.')
        for (let i = 0; i < v_min.length; i++) {
          if (v_target.length >= i + 1) {
            if (parseInt(v_target[i]) < parseInt(v_min[i])) {
              valid = false
              break
            } 
          } else {
            break
          }
        }
      }

      if (!valid) {
        this.msg = `${this.app.name} version must above ${this.minAppVersion}!`
        return
      }

      loadMicroApp({
        name: this.id,
        entry: this.app.entry,
        container: '#' + this.id,
        props: {
          ma: 'containered',
          routePath: this.routePath
        }
      }, {})
    }
  }
}
</script>
