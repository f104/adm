<template>
    <div id="app">
        <LoginView/>
        <MainView/>
    </div>
</template>

<script>
    import {HTTP} from '@/helpers/http'
    import LoginView from '@/components/LoginView'
    import MainView from '@/components/MainView'
    export default {
        name: 'App',
        components: {
            LoginView,
            MainView,
        },
        created() {
            // check auth and get permissions
            HTTP.post('Security/Getperms')
            .then(response => {
                if (response != null && typeof response.perms != 'undefined') {
                    // save perms as obj for fast search
                    for (var i = 0; i < response.perms.length; i++) {
                        var key = response.perms[i]
                        this.$root.store.perms[key] = true
                    }
                }
                this.$root.store.init = true
            })
        }
    }
</script>

<style>
    html, body {
        padding: 0;
        margin: 0;
        min-height: 100vh;
    }
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        min-height: 100vh;
        font-size: 14px;
    }
    .el-dialog {
        width: auto;
        max-width: 70%;
    }
    .el-alert {
        margin-bottom: 20px;
    }
    .el-table {
        width: 100%;
    }
</style>