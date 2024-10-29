<template>
  <div>{{ in }}</div>
</template>

<script lang="ts" setup>
import { reactive ,inject} from 'vue'
const in=inject("in")
</script>
