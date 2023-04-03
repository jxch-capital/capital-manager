<template>
    <div class="container">
        <n-layout position="absolute">
            <n-layout has-sider position="absolute" class="content">
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
                                key-field="key"
                                label-field="label"
                                children-field="children"
                                @update:value="handleUpdateValue"
                        />
                    </n-layout-sider>
                    <n-layout>
                        <router-view/>
                    </n-layout>
                </n-layout>
            </n-layout>
        </n-layout>
    </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue'
import type {MenuOption} from 'naive-ui'
import {useRouter, useRoute} from "vue-router";
import {index_routers} from '@/router/routes/index_routers'


const menuOptions: MenuOption[] = index_routers

export default defineComponent({
    setup() {
        const router = useRouter();
        const handleUpdateValue = (key: any, item: any) => {
            router.push({path: key});
        };
        onMounted(() => {
            document.getElementsByClassName('n-menu-item-content__icon')[0].click()
        })
        return {
            collapsed: ref(true),
            menuOptions,
            handleUpdateValue
        }
    },

})

</script>

<style lang="scss">
.container {
  height: 100%;
  width: 100%;
}

</style>