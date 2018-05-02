<template>
    <div><el-button type="danger" @click="logout">Выйти</el-button></div>
</template>

<script>
    import {HTTP} from '@/helpers/http'
    export default {
        name: 'LogoutView',
        methods: {
            logout () {
                HTTP.post('Security/Logout')
                this.$cookie.delete('uid')
                this.$cookie.delete('sid')
                this.$root.store.perms = {}
                this.$router.push('/')
            }
        }
    }
</script>