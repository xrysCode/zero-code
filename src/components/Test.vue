<script setup lang="ts">
import { ref } from 'vue'
const isActive = ref(true)
const hasError = ref(false)
</script>

<template>
  <textarea id="story" name="story" rows="5" cols="33">
It was a dark and stormy night...
</textarea
  >
  <div
    class="static"
    :class="{ active: isActive, 'text-danger': hasError }"
  ></div>
</template>

<style lang="scss" scoped></style>
