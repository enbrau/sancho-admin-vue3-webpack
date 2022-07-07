<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-bind="$attrs" />
  <svg v-else :class="svgClass" aria-hidden="true" v-bind="$attrs">
    <use :href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    isExternal() {
      return /^(https?:|mailto:|tel:)/.test(this.iconClass) || this.iconClass.indexOf('.svg') > 0
    },
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    svgUrl() {
      return this.iconClass
    },
    styleExternalIcon() {
      return {
        '-webkit-mask-image': `url(${this.svgUrl})`,
        '-webkit-mask-size': `100% 100%`,
        'mask': `url(${this.svgUrl})`,
        'mask-size': `100% 100%`
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor !important;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor !important;
  mask-size: cover!important;
  display: inline-block;
}
</style>
