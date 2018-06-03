<template>
    <el-select :placeholder="label"
               :value="value"
               clearable @change="handleValue"
               :size="size" 
               filterable :allow-create="allowCreate">
        <el-option v-for="item in data" 
                   :label="item.label" 
                   :value="item.value"
                   :key="item.value"></el-option>
        <el-pagination
            v-if="total > pageSize"
            small
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-size="pageSize"
            :total="total">
        </el-pagination>
    </el-select>                            
</template>

<script>
    import {HTTP} from '@/helpers/http'

    export default {
        name: 'Combo',
        props: {
            value: {
                type: Number,
            },
            className: {
                type: String,
                required: true
            },
            whereProp: {
                type: String,
                required: false
            },
            whereValue: {
                required: false
            },
            allowCreate: {
                type: Boolean,
                default: false
            },
            label: {
                type: String,
                default: 'выберите из списка'
            },
            size: {
                type: String,
                default: 'default'
            },
        },
        data() {
            return {
                data: [],
                page: 1,
                pageSize: 30,
                total: 0,
                init: false,
            }
        },
        watch: {
            whereValue: function(val) {
                this.page = 1
                this.load()
            }
        },
        computed: {
            where: function () {
                    let where = {}
                    if (this.whereProp && this.whereValue) {
                        where[this.whereProp] = this.whereValue
                    }
                    return where
                },
        },
        methods: {
            load: function () {
                HTTP.post(`${this.className}/Getlist`, {
                    combo: true,
                    page: this.page,
                    where: this.where,
                })
                .then(response => {
                    this.data = response.data
                    this.total = response.total
                })
            },
            handleCurrentChange: function (page) {
                this.page = page
                this.load()
            },
            handleValue: function (value) {
                this.$emit('input', value)
            },
            handleInitial: function () {
                this.log(this.value)
            },
        },
        created() {
            this.load()
        },
    };
</script>