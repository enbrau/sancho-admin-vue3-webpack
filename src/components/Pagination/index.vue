<template>
  <el-pagination
    :current-page="modelValue.pageNumber"
    :page-size="modelValue.pageSize"
    :background="background"
    :layout="layout"
    :page-sizes="pageSizes"
    :total="modelValue.totalRecord || 0"
    v-bind="$attrs"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
import { deepClone } from '@/utils'

export default {
  name: 'Pagination',
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleSizeChange(val) {
      const page = deepClone(this.modelValue)
      page.pageSize = val
      this.$emit('update:modelValue', page)
      this.$emit('pagination')
      // if (this.autoScroll) {
      //   scrollTo(0, 800)
      // }
    },
    handleCurrentChange(val) {
      const page = deepClone(this.modelValue)
      page.pageNumber = val
      this.$emit('update:modelValue', page)
      this.$emit('pagination')
      // if (this.autoScroll) {
      //   scrollTo(0, 800)
      // }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 0px;
  margin: 15px 0;
}
.pagination-container.hidden {
  display: none;
}
</style>
