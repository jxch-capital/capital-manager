<template>
    <n-card title="账户基础信息" hoverable>
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
            <n-form-item label="账户总资产" path="inputValue">
                <n-input v-model:value="baseInfo.totalAssets"/>
            </n-form-item>
            <n-form-item label="账户波动率(%)" path="inputValue">
                <n-input v-model:value="baseInfo.totalAssetsVolatility"/>
            </n-form-item>
            <n-form-item label="标的最高比重(%)" path="inputValue">
                <n-input v-model:value="baseInfo.targetRate" placeholder="单一品种比重不得超过总资产的50%"/>
            </n-form-item>
            <n-divider />
            <div>账户最大波动额：<span>{{ baseInfo.totalAssets * baseInfo.totalAssetsVolatility / 100 }}</span></div>
            <div>标的最大买入额：<span>{{ baseInfo.totalAssets * baseInfo.targetRate / 100 }}</span></div>
        </n-form>
    </n-card>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
    name: "BaseInfo",
    props: {
        baseInfo: Object
    }
})

</script>

<style scoped>

</style>