<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <input
      v-bind="$attrs"
      :value="value"
      @input="updateValue"
      v-on="listeners"
      class="field"
    />
  </div>
</template>

<script>
import { formFieldMixin } from '@/mixins/formFieldMixin'

export default {
  mixins: [formFieldMixin],
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: this.updateValue
      }
    }
  }
}
</script>

<style></style>
