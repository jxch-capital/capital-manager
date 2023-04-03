<template>
    <n-space>
        <n-card title="头寸计算器">
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
                <n-form-item label="总资产" path="inputValue">
                    <n-input v-model:value="calcPosition.totalAssets"/>
                </n-form-item>
                <n-form-item label="总资产波动率(%)" path="inputValue">
                    <n-input v-model:value="calcPosition.totalAssetsVolatility"/>
                </n-form-item>
                <n-form-item label="标的最高比重(%)" path="inputValue">
                    <n-input v-model:value="calcPosition.targetRate" placeholder="单一品种比重不得超过总资产的50%"/>
                </n-form-item>
                <n-form-item label="标的价格" path="inputValue">
                    <n-input v-model:value="calcPosition.targetPrice"/>
                </n-form-item>
                <n-form-item label="止损(%)" path="inputValue">
                    <n-input v-model:value="calcPosition.deadline" placeholder="止损只需填一个"/>
                </n-form-item>
                <n-form-item label="标的最小头寸规模" path="inputValue">
                    <n-input v-model:value="calcPosition.minPositionSizeOfTheTarget"/>
                </n-form-item>
                <n-divider title-placement="left">
                    计算结果
                </n-divider>
                购入标的手数：<span :style="{color: fontColor.resColor}">{{ calcPositionRes.buyPositionSize }}</span>
            </n-form>
        </n-card>
    </n-space>
</template>

<script>
import {defineComponent, reactive, ref, watch} from 'vue'

export default defineComponent({
    name: "Calculator",
    setup() {
        const calcPosition = ref({
            totalAssets: null,
            totalAssetsVolatility: 1,
            targetRate: 30,
            targetPrice: null,
            deadline: 2,
            deadlinePrice: null,
            minPositionSizeOfTheTarget: 1
        })

        let calcPositionRes = reactive({buyPositionSize: 0})

        watch(calcPosition, (calcPosition) => {

            calcPositionRes.buyPositionSize = Math.min(Math.floor((calcPosition.totalAssets * calcPosition.targetRate / 100 / calcPosition.targetPrice)),
                Math.floor((calcPosition.totalAssets * calcPosition.targetRate / 100 * calcPosition.totalAssetsVolatility / 100) /
                    (calcPosition.targetPrice * calcPosition.deadline / 100) * calcPosition.minPositionSizeOfTheTarget))
        }, {deep: true})

        return {
            calcPosition,
            calcPositionRes,
            fontColor: ref({
                resColor: 'green'
            })
        }
    }
})
</script>

<style scoped>

</style>