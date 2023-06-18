<template>
  <n-space :vertical="false" size="small">
    <n-radio-group size="small" v-model:value="condition.cycle">
      <n-radio-button size="small" value="day" checked>
        D
      </n-radio-button>
      <n-radio-button size="small" value="month" checked>
        M
      </n-radio-button>
      <n-radio-button size="small" value="year" checked>
        Y
      </n-radio-button>
    </n-radio-group>
    <n-input-number size="small" v-model:value="condition.last" clearable placeholder="last"
                    style="width: 110px"/>
  </n-space>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: "DateSelector",

  props: {
    condition: Object,
  }
})
</script>

<style scoped>

</style>