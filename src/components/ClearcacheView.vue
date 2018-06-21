<template>
    <el-button type="text" @click="clear">Очистить кеш</el-button>
</template>

<script>
    import {HTTP} from '@/helpers/http'
    export default {
        name: 'ClearcacheView',
        computed: {
            allowClear: function() { 
                return this.checkPerm('clear_cache') 
            },
        },
        methods: {
            clear () {
                HTTP.post('Cache/Clear')
            }
        }
    }
</script>