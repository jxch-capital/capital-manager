<template>
    <n-card title="盈亏比计算器" hoverable>
        <n-form
                ref="formRef"
                :model="model"
                :rules="rules"
                label-placement="left"
                label-width="auto"
                require-mark-placement="right-hanging"
                :size="size"
                :style="{maxWidth: '640px'}"
        >
            <n-form-item label="标的价格" path="inputValue">
                <n-input v-model:value="calcPL.targetPrice"/>
            </n-form-item>
            <n-form-item label="止损价" path="inputValue" :disabled="true">
                <n-input v-model:value="calcPL.deadlinePrice"/>
            </n-form-item>
            <n-form-item label="第一目标位" path="inputValue">
                <n-input v-model:value="calcPL.targetPrice1"/>
            </n-form-item>
            <n-form-item label="第二目标位" path="inputValue">
                <n-input v-model:value="calcPL.targetPrice2"/>
            </n-form-item>
            <n-divider />
            <div>止损率 ：<span>{{ calcPL.deadlineRate }}%</span></div>
            <div>盈利率1：<span>{{ ((calcPL.targetPrice1 - calcPL.targetPrice) / calcPL.targetPrice * 100).toFixed(3) }}%</span></div>
            <div>盈利率2：<span>{{ ((calcPL.targetPrice2 - calcPL.targetPrice) / calcPL.targetPrice * 100).toFixed(3) }}%</span></div>
            <n-divider />
            <div>第一盈亏比：<span
                    :style="{color: calcPL.targetPLRate1 >=3 ? fontColor.goodResColor : calcPL.targetPLRate1 <= 1 ? fontColor.badResColor : fontColor.resColor}">{{
                calcPL.targetPLRate1
                }}</span></div>
            <div>第二盈亏比：<span
                    :style="{color: calcPL.targetPLRate2 >=3 ? fontColor.goodResColor : calcPL.targetPLRate2 <= 1 ? fontColor.badResColor : fontColor.resColor}">{{
                calcPL.targetPLRate2
                }}</span></div>
        </n-form>
    </n-card>
</template>

<script>
import {defineComponent, ref, toRefs, watch} from 'vue'

export default defineComponent({
    name: "PLCalc",
    props: {
        calcPL: Object
    },
    setup(props) {
        const {calcPL} = toRefs(props)
        watch(calcPL, (calcPL) => {
            calcPL.deadlineRate = ((calcPL.targetPrice - calcPL.deadlinePrice) / calcPL.targetPrice * 100).toFixed(3)
            calcPL.targetPLRate1 = ((calcPL.targetPrice1 - calcPL.targetPrice) / (calcPL.targetPrice - calcPL.deadlinePrice)).toFixed(3)
            calcPL.targetPLRate2 = ((calcPL.targetPrice2 - calcPL.targetPrice) / (calcPL.targetPrice - calcPL.deadlinePrice)).toFixed(3)
        }, {deep: true})

        return {
            fontColor: ref({
                goodResColor: 'green',
                badResColor: 'red',
                resColor: 'blue'
            })
        }
    }
})

</script>

<style scoped>

</style>