<template>
    <n-space>
        <BaseInfo :base-info="calcData"/>
        <PLCalc :calc-p-l="calcData"/>
        <PositionCalc :calc-position="calcData"/>
    </n-space>
</template>

<script>
import {defineComponent, reactive, ref, watch} from 'vue'
import BaseInfo from "vv/calculators/BaseInfo.vue";
import PositionCalc from "vv/calculators/PositionCalc.vue";
import PLCalc from "vv/calculators/PLCalc.vue";

export default defineComponent({
    name: "Calculator",
    components: {PLCalc, PositionCalc, BaseInfo},
    setup() {
        const calcData = reactive({
            totalAssets: null,
            totalAssetsVolatility: 1,
            targetRate: 30,
            targetPrice: null,
            deadlineRate: 2,
            deadlinePrice: null,
            minPositionSizeOfTheTarget: 1,
            buyPositionSize: 0,
            targetPrice1: null,
            targetPrice2: null,
            targetPLRate1: null,
            targetPLRate2: null,
        })

        return {
            calcData
        }
    }
})
</script>

<style scoped>

</style>