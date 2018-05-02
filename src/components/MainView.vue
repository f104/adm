<template>
    <el-container v-if="$root.store.auth">
        <el-aside width="200px">
            <div class="aside-header">
                <MenuView/>
            </div>
            <div class="aside-footer">
                <ClearcacheView v-if="allowClearCache"/>
                <LogoutView/>
            </div>
        </el-aside>
        <el-main>
            <router-view/>
        </el-main>
    </el-container>
</template>

<script>
    import LogoutView from '@/components/LogoutView'
    import ClearcacheView from '@/components/ClearcacheView'
    import MenuView from '@/components/MenuView'
    export default {
        name: 'MainView',
        components: {
            MenuView,
            LogoutView,
            ClearcacheView,
        },
        computed: {
            allowClearCache: function() { 
                return this.checkPerm('clear_cache') 
            },
        }
    }
</script>

<style scoped>
    .el-container {
        min-height: 100vh;
    }
    .el-main {
        margin-left: 200px;
    }
    .el-aside {
        width: 200px;
        background-color: rgb(238, 241, 246);
        position: fixed;
        min-height: 100vh;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .el-menu {
        margin-left: -20px;
        margin-right: -19px;
    }
</style>