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
        <el-submenu v-if="$root.store.perms.is_root||$root.store.perms.offices_view">
            <template slot="title">
                <span>Офисы</span>
            </template>
            <el-menu-item index="/offices/list">
                <span>Список</span>
            </el-menu-item>
            <el-menu-item index="/offices/order">
                <span>Сортировка</span>
            </el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>
    export default {
        name: 'MenuView',
    }
</script>