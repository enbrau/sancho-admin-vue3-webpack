<template>
  <el-col :span="span" :class="['sansho-dashboard-panel', `sansho-dashboard-panel__color-${modelValue.color || 'primary'}`]">
    <el-card shadow="hover">
      <template #header>
        <svg-icon :icon-class="modelValue.icon || 'drag'" />&nbsp;{{modelValue.title}}
        <div style="float: right">
          <el-dropdown trigger="click">
            <el-button size="small" type="info" text>
              <svg-icon icon-class="more" />
            </el-button>
            <template #dropdown>
              <el-row style="padding: 20px 15px; padding-bottom: 0;">
                <el-col :span="24">
                  <el-form label-position="top">
                    <el-form-item label="颜色">
                      <el-radio-group v-model="modelValue.color" size="small" fill="var(--el-color-primary-light-3)">
                        <el-radio-button label="none" border>
                          <svg-icon icon-class="square" style="background-color: var(--el-bg-color);" />
                        </el-radio-button>
                        <el-radio-button label="primary" border>
                          <svg-icon icon-class="square" style="background-color: var(--el-color-primary)" />
                        </el-radio-button>
                        <el-radio-button label="danger" border>
                          <svg-icon icon-class="square" style="background-color: var(--el-color-danger)" />
                        </el-radio-button>
                        <el-radio-button label="warning" border>
                          <svg-icon icon-class="square" style="background-color: var(--el-color-warning)" />
                        </el-radio-button>
                        <el-radio-button label="success" border>
                          <svg-icon icon-class="square" style="background-color: var(--el-color-success)" />
                        </el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="宽度比例">
                      <el-radio-group v-model="modelValue.width" size="small">
                        <el-radio-button label="1" />
                        <el-radio-button label="1/2" />
                        <el-radio-button label="1/3" />
                        <el-radio-button label="2/3" />
                        <el-radio-button label="1/4" />
                        <el-radio-button label="3/4" />
                      </el-radio-group>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <el-divider style="margin: 0" />
              <el-row style="padding: 0;">
                <el-col :span="24">
                  <slot name="actions" />
                </el-col>
              </el-row>
            </template>
          </el-dropdown>
        </div>
      </template>
      <div :style="{ height: (modelValue.height || 260) + 'px', overflow: 'auto' }">
        <slot />
      </div>
    </el-card>
  </el-col>
</template>

<script>
export default {
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },
  computed: {
    span() {
      switch(this.modelValue.width || '1') {
        case '1':
          return 24
        case '1/2':
          return 12
        case '1/3':
          return 8
        case '2/3':
          return 16
        case '1/4':
          return 6
        case '3/4':
          return 18
        case '1/6':
          return 4
        case '5/6':
          return 20
        case '1/8':
          return 3
        case '7/8':
          return 21
        case '1/12':
          return 2
        default: 
          return 24
      }
    }
  },
  watch: {
    modelValue: {
      handler() {
        this.$emit('update:modelValue', this.modelValue)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.sansho-dashboard-panel {

  &__color-none {
    .el-card__header {
      border-top: 5px solid transparent;
    }
  }
  &__color-primary {
    .el-card__header {
      border-top: 5px solid var(--el-color-primary);
    }
  }
  &__color-danger {
    .el-card__header {
      border-top: 5px solid var(--el-color-danger);
    }
  }
  &__color-warning {
    .el-card__header {
      border-top: 5px solid var(--el-color-warning);
    }
  }
  &__color-success {
    .el-card__header {
      border-top: 5px solid var(--el-color-success);
    }
  }

  .el-card {
    border-radius: 5px;
    transform: .2s;
    
    .el-card__header {
      
      cursor: move;
      border-bottom: 0;
    }

    .el-card__body {
      padding-top: 0;
    }
  }
}
</style>
