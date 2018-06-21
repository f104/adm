<template>
    <div>
        <el-alert type="info" title="">Порядок отображения представительств. Не забываем "Очистить кеш".</el-alert>
        <draggable v-model="rows" @change="handleSort" :move="checkPending">
            <el-card v-for="row in rows" :key="row.id">
                {{ row.region_name }}, {{ row.city_name }}, {{ row.address }}
            </el-card>
        </draggable>
    </div>
</template>

<script>
    import {HTTP} from '@/helpers/http'
    import draggable from 'vuedraggable'
    export default {
        components: {
            draggable,
        },
        data() {
            return {
                className: 'Office', // класс получаемого объекта
                rows: [],
                pending: false,
                help: 'Список представительств. Отображается в "контактах". Влияет на расчет цены (поле регион).\n\
                        Неопубликованные не показываются. Кешируются, поэтому после внесения изменений нужно "Очистить кеш".',
            }
        },
        methods: {
            load: function () {
                HTTP.post(`${this.className}/Getlist`, {
                    limit: 0,
                })
                .then(response => {
                    this.rows = response
                })
            },
            checkPending: function() {
                return !this.pending
            },
            handleSort: function(res) {
                this.log(res)
                this.pending = true
                HTTP.post(`${this.className}/Sort`, {
                    id: res.moved.element.id,
                    fields: {
                        oldIndex: res.moved.oldIndex,
                        newIndex: res.moved.newIndex,
                    }
                })
                .then(response => {
                    this.pending = false
                })
            }
        },
        created() {
            this.load()
        },
    }
</script>

<style scoped>
</style>