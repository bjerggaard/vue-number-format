<template>
  <input
    :value="modelValue"
    type="text"
    class="shadow-sm rounded-md text-base transition-all disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300 focus:border-primary focus:ring focus:ring-offset-0 focus:ring-primary focus:ring-opacity-50"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
export default {
  name: "BaseInput",
  props: {
    modelValue: {
      default: undefined,
    },
    label: {
      type: String,
      required: false,
    },
  },
  emits: ["update:modelValue"],
};
</script>

<style scoped></style>
