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
        <el-menu-item index="/eventlog" v-if="$root.store.perms.is_root||$root.store.perms.eventlog_view">
            <span>Журнал</span>
        </el-menu-item>
    </el-menu>
</template>

<script>
    export default {
        name: 'MenuView',
    }
</script>