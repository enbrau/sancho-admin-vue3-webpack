<template>
  <span class="sancho-count-up" ref="count" />
</template>

<script>
import { CountUp } from 'countup.js'

// https://www.npmjs.com/package/countup.js
const defaultOptions = {
  startVal: 0, // number to start at (0)
  decimalPlaces: 0, // number of decimal places (0)
  duration: 2, // animation duration in seconds (2)
  useGrouping: true, // example: 1,000 vs 1000 (true)
  useEasing: true, // ease animation (true)
  smartEasingThreshold: 999, // smooth easing for large numbers above this if useEasing (999)
  smartEasingAmount: 333, // amount to be eased for numbers above threshold (333)
  separator: ',', // grouping separator (',')
  decimal: '.' // decimal ('.')
  // easingFn: easing function for animation (easeOutExpo)
  // easingFn: (t: number, b: number, c: number, d: number) => number,
  // formattingFn: (n: number) => string, // this function formats result
  // prefix: string, // text prepended to result
  // suffix: string, // text appended to result
  // numerals: string[], // numeral glyph substitution
}

export default {
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      countUp: null
    }
  },
  watch: {
    modelValue: {
      handler: 'render',
      immdiate: true
    }
  },
  mounted() {
    this.render()
  },
  methods: {
    render() {
      if (!this.countUp) {
        const options = this.$lodash.extend({}, defaultOptions, this.options)
        this.countUp = new CountUp(this.$refs.count, this.modelValue, options)
        this.countUp.start()
      } else {
        this.countUp.update(this.modelValue)
      }
      
    }
  }
}
</script>

<style scoped>
.sancho-count-up {
  font-family: var(--mono-font);
}
</style>
