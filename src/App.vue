<template>
  <n-message-provider>
    <n-notification-provider placement="top-left">
      <router-view/>
    </n-notification-provider>
  </n-message-provider>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    document.title = "Capital"
  }
})
</script>