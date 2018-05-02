<template>
    <el-main v-if="!$root.store.auth && $root.store.init">
        <el-form :model="fields" :rules="rules" 
            @submit.prevent="submit" label-width="120px" ref="loginForm">
            <el-form-item label="E-mail" prop="email">
                <el-input v-model="fields.email" @keyup.enter.native="submit" auto-complete="on"></el-input>
            </el-form-item>
            <el-form-item label="Пароль" prop="givenPassword">
                <el-input type="password" v-model="fields.givenPassword" @keyup.enter.native="submit"></el-input>
            </el-form-item>
            <el-form-item label="Запомнить меня" prop="remeberMe">
                <el-switch v-model="fields.rememberMe"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit">Войти</el-button>
            </el-form-item>
        </el-form>
    </el-main>
</template>

<script>
    import {HTTP} from '@/helpers/http'
    export default {
        name: 'LoginView',
        data() {
            return {
                fields: {
                    email: null,
                    givenPassword: null,
                    rememberMe: true,
                },
                rules: {
                    email: [
                        {type: "email", required: true, trigger: 'blur'}
                    ],
                    givenPassword: [
                        {required: true, trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            submit() {
                this.$refs['loginForm'].validate((valid) => {
                    if (valid) {
                        HTTP.post('Security/Login', this.fields)
                        .then(response => {
                            if (response) {
                                let date = new Date
                                date.setTime(date.getTime() + response.lifetime * 1000)
                                this.$cookie.set('uid', response.uid, {expires: date})
                                this.$cookie.set('sid', response.sid, {expires: date})
                                this.$root.store.httpParams.uid = response.uid
                                this.$root.store.httpParams.sid = response.sid
                                if (typeof response.perms != 'undefined') {
                                    // save perms as obj for fast search
                                    for (var i = 0; i < response.perms.length; i++) {
                                        var key = response.perms[i]
                                        this.$root.store.perms[key] = true
                                    }
                                }
                                this.$root.store.init = true
                                this.fields.givenPassword = null
                            }
                        })
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .el-main {
        justify-content: center;
        display: flex;
        justify-items: center;
        min-height: 100vh;
        align-items: center;
    }
    .el-form {
        max-width: 100%;
        width: 400px;
    }
</style>