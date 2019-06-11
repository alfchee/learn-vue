<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <input v-bind="$attrs" :value="value" @input="updateValue" class="field" />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: ''
    },
    value: [String, Number]
  },
  methods: {
    updateValue(event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>

<style></style>
