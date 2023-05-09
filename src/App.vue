<template>
    <n-message-provider>
        <router-view/>
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