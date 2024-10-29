<template>
  <div>{{ inner }}</div>
</template>

<script lang="ts" setup>
import { reactive, inject } from 'vue'
const inner = inject('inner')
</script>
