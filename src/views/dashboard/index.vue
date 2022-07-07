<template>
  <div class="view-body-wrapper">
    <amount-input v-model="value" ></amount-input>
    {{value}}
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 1
    }
  }
}
</script>
