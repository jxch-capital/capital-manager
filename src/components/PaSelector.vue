<template>
  <n-select size="small" v-model:value="condition.value" :options="condition.paOptions" multiple filterable tag/>
</template>

<script>
import {defineComponent, reactive, watch, toRaw} from "vue";
import {func} from "./pa"

export default defineComponent({
  name: "PaSelector",
  props: {
    kLine: Object,
    pa: Object,
  },
  emits: ['update:pa'],
  setup(props, {emit}) {
    const condition = reactive({
      loading: false,
      value: [func.baldK],
      paOptions: [
        {
          label: '光头K线',
          value: func.baldK
        }
      ],
      pa:{},
    })

    watch(() => props.kLine, (newData) => {
      condition.pa = []
      for (const funcI in condition.value) {
        const func = condition.value[funcI]
        const kLineCodeObj = toRaw(newData)
        for(const codeI in Object.keys(kLineCodeObj)) {
          const code = Object.keys(kLineCodeObj)[codeI]
          const kLine = kLineCodeObj[code]
          if (condition.pa[code]) {
            condition.pa[code].push(func(kLine))
          } else {
            condition.pa[code] = [func(kLine)]
          }
        }
      }
      emit('update:pa', condition.pa)
    })

    return {
      condition,
    }
  }
})
</script>

<style scoped>

</style>