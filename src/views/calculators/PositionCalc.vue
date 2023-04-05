<template>
    <n-card title="头寸计算器" hoverable>
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
                <n-input v-model:value="calcPosition.targetPrice"/>
            </n-form-item>
            <n-form-item label="一手头寸规模" path="inputValue">
                <n-input v-model:value="calcPosition.minPositionSizeOfTheTarget"/>
            </n-form-item>
            <n-form-item
                    :span="12"
                    label="买入信心"
                    path="radioGroupValue"
            >
                <n-radio-group v-model:value="calcPosition.winningPercentage" name="radiogroup2">
                    <n-space :vertical="true" :size="'small'">
                        <n-radio-button :value="50" checked>
                            模糊
                        </n-radio-button>
                        <n-radio-button :value="60">
                            有把握
                        </n-radio-button>
                        <n-radio-button :value="70">
                            很有把握
                        </n-radio-button>
                        <n-radio-button :value="80">
                            很确定
                        </n-radio-button>
                    </n-space>
                </n-radio-group>
            </n-form-item>
            <n-divider/>
            <div>操作胜率：<span style="color: gray">{{ calcPosition.winningPercentage }}%</span></div>
            <div>买入手数：<span :style="{color: fontColor.resColor}">{{ calcPosition.buyPositionSize }}</span></div>
            <div>买入成本：<span>{{ (calcPosition.buyPositionSize * calcPosition.targetPrice) }}</span></div>
            <div>账户占比：<span>{{
                (calcPosition.buyPositionSize * calcPosition.targetPrice / calcPosition.totalAssets * 100).toFixed(3)
                }}%</span></div>
            <div>最大亏损：<span>{{
                (calcPosition.targetPrice - calcPosition.deadlinePrice) * calcPosition.buyPositionSize
                }}</span></div>
            <div>亏损占比：<span>{{
                ((calcPosition.targetPrice - calcPosition.deadlinePrice) * calcPosition.buyPositionSize / calcPosition.totalAssets * 100).toFixed(3)
                }}%</span></div>
            <div>预期盈利：<span>{{
                (calcPosition.targetPrice1 - calcPosition.targetPrice) * calcPosition.buyPositionSize
                }}</span></div>
            <div>账户增长：<span>{{
                ((calcPosition.targetPrice1 - calcPosition.targetPrice) * calcPosition.buyPositionSize / calcPosition.totalAssets * 100).toFixed(3)
                }}%</span></div>
        </n-form>
    </n-card>
</template>

<script>
import {defineComponent, ref, toRefs, watch} from 'vue'

export default defineComponent({
    name: "PositionCalc",

    props: {
        calcPosition: Object
    },
    setup(props) {
        const {calcPosition} = toRefs(props)
        watch(calcPosition, (calcPosition) => {
            calcPosition.buyPositionSize = Math.floor(Math.min(Math.floor((calcPosition.totalAssets * calcPosition.targetRate / 100 / calcPosition.targetPrice)),
                Math.floor((calcPosition.totalAssets * calcPosition.totalAssetsVolatility / 100) /
                    ((calcPosition.targetPrice - calcPosition.deadlinePrice) * calcPosition.minPositionSizeOfTheTarget))) * calcPosition.winningPercentage / 100)
        }, {deep: true})

        return {
            fontColor: ref({
                resColor: 'green'
            })
        }
    }
})

</script>

<style scoped>

</style>