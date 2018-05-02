<template>
    <el-menu
        v-if="$root.store.auth"
        :router="true">
        <el-menu-item index="/catalog">
            <span>Каталог</span>
        </el-menu-item>
        <el-menu-item index="/chunk">
            <span>Чанки</span>
        </el-menu-item>
    </el-menu>
</template>

<script>
    export default {
        name: 'MenuView',
        methods: {
            itemVisible: function(item) {
                return this.checkPerm(item)
            }
        }
    }
</script>