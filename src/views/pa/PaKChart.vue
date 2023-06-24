<template>

</template>

<script>
import {defineComponent, reactive, watch} from "vue";

export default defineComponent({
  name: "PaKChart",
  props: {
    kLine: Object,
    pa: Object,
  },
  setup(props) {
    watch(() => props.pa, (newData) => {
      console.log(newData)
    })
  }



})


</script>

<style scoped>

</style>