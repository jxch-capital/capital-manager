<template>
    <n-layout has-sider>
        <n-layout-sider
            bordered
            collapse-mode="width"
            :collapsed-width="64"
            :width="240"
            :collapsed="collapsed"
            show-trigger
            @collapse="collapsed = true"
            @expand="collapsed = false"
        >
            <n-menu
                :collapsed="collapsed"
                :collapsed-width="64"
                :collapsed-icon-size="22"
                :options="menuOptions"
                key-field="whateverKey"
                label-field="whateverLabel"
                children-field="whateverChildren"
            />
        </n-layout-sider>
        <n-layout />
    </n-layout>
</template>

<script lang="ts">
import { defineComponent, h, ref, Component } from 'vue'
import { NIcon, NLayout, NLayoutSider, NMenu } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
    Calculator as Calculator,
    TrendingUp as TrendingUp
} from '@vicons/ionicons5'

function renderIcon (icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
    {
        whateverLabel: '计算器',
        whateverKey: 'calculator',
        icon: renderIcon(Calculator),
        disabled: false,
        whateverChildren: [
            {
                whateverLabel: '交易计算器',
                icon: renderIcon(TrendingUp),
                whateverKey: 'trading-calculator'
            }
        ]
    }
]

export default defineComponent({
    components: {
        NLayout,
        NLayoutSider,
        NMenu
    },
    setup () {
        return {
            collapsed: ref(true),
            menuOptions
        }
    }
})
</script>