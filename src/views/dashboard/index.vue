<template>
  <div v-loading="loading" class="view-body-wrapper adapt-height">
    <!-- <el-affix target=".view-body-wrapper" :offset="105"> -->
    <el-row style="padding-bottom: 10px" :gutter="20">
      <el-col :span="12">
        <span style="font-weight: bold; opacity: .8;">{{greet}}，{{$store.state.subscriber.profile.nickname}}！</span>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button size="small" type="primary" text @click="widgetDialogVisible = true">
          <el-icon><Plus /></el-icon>
          添加组件
        </el-button>
      </el-col>
    </el-row>
    <!-- </el-affix> -->
    <draggable v-if="widgets && widgets.length>0" v-model="widgets" item-key="id" handle=".el-card__header" class="el-row" style="margin: -7.5px;">
      <template #item="{index}">
        <dashboard-panel v-model="widgets[index]" style="padding: 7.5px;">
          <template #actions>
            <el-dropdown-menu>
              <el-dropdown-item style="text-align: center" @click="removeWidget(index)">
                <span style="color: var(--el-color-danger); flex-grow: 1;">移除</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
          <template #default>
            <component :is="getWidgetComponent(widgets[index])" />
          </template>
        </dashboard-panel>
      </template>
    </draggable>
    <el-empty v-else />
  </div>
  <el-dialog v-model="widgetDialogVisible" width="65%">
    <template #header>
      <svg-icon icon-class="widget" />
      添加仪表盘组件
    </template>
    <el-row v-if="$store.state.dashboard.availableWidgets && $store.state.dashboard.availableWidgets.length>0" :gutter="15">
      <el-col v-for="widget in $store.state.dashboard.availableWidgets" :key="widget.id" :span="12">
        <div class="sancho-widget-card">
          <div class="sancho-widget-card__icon">
            <svg-icon :icon-class="widget.icon || 'widget'" />
          </div>
          <div class="sancho-widget-card__text">
            <div class="sancho-widget-card__text__title">
              <span class="text">{{widget.title}}</span>
              <el-button v-if="isHidden(widget)" type="primary" text bg size="small" @click="addWidget(widget)">添加组件</el-button>
              <el-button v-else type="" text bg size="small" disabled>已添加</el-button>
            </div>
            <div class="sancho-widget-card__text__desc">
              <span>{{widget.remark}}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-empty v-else />
    <template #footer>
      <el-link type="primary" size="small" style="float: left" @click="restoreDefaultWidgets">重置仪表盘为默认配置</el-link>
      <el-button size="small" @click="this.widgetDialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
// https://github.com/SortableJS/vue.draggable.next
import Draggable from 'vuedraggable'
import { loadRealTimeWidgets, savePreferanceWidgets, loadDefaultWidgets } from './utils.js'
import { deepClone } from '@/utils'

export default {
  components: { Draggable },
  data() {
    return {
      loading: false,
      widgets: [],
      widgetDialogVisible: false,
      timer: null,
      loaded: false
    }
  },
  computed: {
    sid() {
      this.$store.state.subscriber.sid
    },
    greet() {
      // 获取当前时间
      let timeNow = new Date();
      // 获取当前小时
      let hours = timeNow.getHours();
      // 设置默认文字
      let text = ``;
      // 判断当前时间段
      if (hours >= 0 && hours <= 10) {
        text = `早上好`;
      } else if (hours > 10 && hours <= 14) {
        text = `中午好`;
      } else if (hours > 14 && hours <= 18) {
        text = `下午好`;
      } else if (hours > 18 && hours <= 24) {
        text = `晚上好`;
      }
      return text;
    }
  },
  watch: {
    widgets: {
      handler: 'savePreferance',
      deep: true
    }
  },
  async mounted() {
    await this.refreshRealTimeWidgets()
    this.$nextTick(() => {
      this.loaded = true
    })
  },
  methods: {
    async refreshRealTimeWidgets() {
      this.loading = true
      try {
        this.widgets = await loadRealTimeWidgets(true)
      } catch (e) {
        this.widgets = []
      }
      this.loading = false
    },
    isHidden(widget) {
      const widgets = this.widgets
      for (let i = 0; i < widgets.length; i++) {
        const addedWidget = widgets[i]
        if (addedWidget.id === widget.id) {
          return false
        }
      }
      return true
    },
    removeWidget(index) {
      this.widgets.splice(index, 1)
    },
    addWidget(widget) {
      this.widgets.push(widget)
      this.widgetDialogVisible = false
    },
    async restoreDefaultWidgets() {
      this.widgets = await loadDefaultWidgets()
      this.widgetDialogVisible = false
    },
    async savePreferance() {
      if (!this.loaded) {
        return
      }
      if (this.timer) {
        clearTimeout(this.timer)
      }
      const widgets = deepClone(this.widgets)
      this.timer = setTimeout(async () => {
        await savePreferanceWidgets(widgets)
        this.$message({
          showClose: true,
          message: '已保存仪表盘配置！',
          type: 'success',
        })
      }, 2000)
    },
    getWidgetComponent(widget) {
      const widgets = this.$store.state.dashboard.availableWidgets
      for (let i = 0; i < widgets.length; i++) {
        const aWidget = widgets[i]
        if (aWidget.id === widget.id) {
          return aWidget.component
        }
      }
      return null
    }
  }
}
</script>

<style lang="scss">
.sancho-widget-card {
  width: 100%;
  height: 110px;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px dashed var(--el-border-color);
  border-radius: 5px;
  display: flex;

  .sancho-widget-card__icon {
    background-color: var(--el-border-color);
    width: 80px;
    height: 80px;
    margin: 5px;
    border-radius: 10px;
    padding: 7px;
    .svg-icon {
      font-size: 70px;
      color: white;
      opacity: .8;
    }
  }

  .sancho-widget-card__text {
    flex-grow: 1;
    .sancho-widget-card__text__title {
      display: flex;
      .text {
        font-size: 14px;
        font-weight: bold;
        display: inline-flex;
        flex-grow: 1;
        flex-direction: column-reverse;
      }
    }
    .sancho-widget-card__text__desc {
      margin-top: 5px;
    }
  }
}
</style>
