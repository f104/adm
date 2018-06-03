<template>
    <div class="content">
        
        <div class="table-header">
            <el-button 
                v-if="allowEdit"
                type="primary" size="small" icon="el-icon-circle-plus"
                class="table-header__add"
                @click="create">Создать</el-button>
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="tablePage"
                :page-sizes="tableSizes"
                :page-size="tableSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableTotal">
            </el-pagination>
            <el-collapse v-if="tableFilters.length">
                <el-collapse-item title="Фильтры">
                    <el-select v-for="filter in tableFilters"
                               :placeholder="filter.label" 
                               clearable @change="handleFilter"
                               v-model="tableFilter[filter.prop]" size="small">
                        <el-option v-for="item in filter.data" 
                                   :label="item.label" 
                                   :value="item[filter.prop]"
                                   :key="item[filter.prop]"></el-option>
                    </el-select>                            
                </el-collapse-item>
            </el-collapse>
            <el-button 
                v-if="helpBtn"
                type="warning" size="small" icon="el-icon-info"
                @click="showHelp">Помощь</el-button>
        </div>
        <el-table
            :data="tableData"
            stripe>
            <el-table-column
                type="index"
                :index="indexMethod">
            </el-table-column>
            <el-table-column v-for="column in columns"
                min-width="80"
                v-bind="column">
                <template slot-scope="scope">
                    <span v-if="column.html" v-html="format(scope.row[column.prop], column.type)"></span>
                    <span v-else>{{ scope.row[column.prop] }}</span>
                </template>
            </el-table-column>
            <el-table-column
                v-if="allowEdit || allowRemove" 
                label="Действия">
                <template slot-scope="scope">
                    <div class="nowrap">
                        <el-button
                            v-if="allowEdit"
                            size="mini"
                            type="primary"
                            @click="update(scope.$index, scope.row)">Edit</el-button>
                        <el-button
                            v-if="allowRemove"
                            size="mini"
                            type="danger"
                            @click="remove(scope.$index, scope.row)">Remove</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    import {HTTP} from '@/helpers/http'
    
    export default {
        name: 'Table',
        props: {
            className: {
                type: String,
                required: true
            },
            columns: {
                type: Array,
                required: true
            },
            filters: {
                type: Array,
                required: false
            },
            allowEdit: {
                type: Boolean,
                default: false
            },
            allowRemove: {
                type: Boolean,
                default: false
            },
            help: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                tableData: [],
                tableSizes: [30, 50, 100],
                tableSize: 30,
                tablePage: 1,
                tableTotal: 0,
                tableFilters: [],
                tableFilter: {},
            }
        },
        computed: {
            helpBtn: function() {
                return this.help.length != 0
            }
        },
        methods: {
            indexMethod: function(index) {
                return index + 1 + this.tableSize * (this.tablePage - 1)
            },
            handleSizeChange: function (size) {
                this.tablePage = 1
                this.tableSize = size
                this.load()
            },
            handleCurrentChange: function (page) {
                this.tablePage = page
                this.load()
            },
            handleFilter: function () {
                this.tablePage = 1
                this.load()
            },
            load: function () {
                let where = {}
                for (let key in this.tableFilter) {
                    if (this.tableFilter[key] !== '') {
                        where[key] = this.tableFilter[key]
                    }
                }
                HTTP.post(`${this.className}/Getlist`, {
                    page: this.tablePage,
                    limit: this.tableSize,
                    where: where,
                })
                .then(response => {
                    this.tableData = response.data
                    this.tableTotal = response.total
                })
            },
            loadFilters: function () {
                if (!this.filters) return
                for (let key in this.filters) {
                    let filter = {
                        ...this.filters[key],
                        data: []
                    }
                    this.tableFilters.push(filter)
                    this.tableFilter[filter.prop] = ''
                    HTTP.post(`${this.className}/Getlist`, {
                        select: [filter.prop],
                        distinct: true,
                        limit: 0
//                        combo: true,
                    })
                    .then(response => {
                        filter.data = response
                    })
                }
            },
            format: function(value, type = 'string') {
                switch (type) {
                    case 'boolean':
                        value = value ? '<span style="color:green">Да</span>' : '<span style="color:red">Нет</span>'
                        break
                }
                return value
            },
            create: function() {
                this.$emit('update:id', 0)
            },
            update: function(index, row) {
                this.$emit('update:id', row.id)
            },
            remove: function(index, row) {
                this.$emit('remove:row', row)
            },
            showHelp: function() {
                this.$message({
                    showClose: true,
                    duration: 0,
                    message: this.help,
                });
            },
        },
        created() {
            this.load()
            this.loadFilters()
        },
    };
</script>

<style scoped>
    .content {
        padding-top: 50px;
    }
    .table-header {
        position: fixed;
        top: 0;
        left: 200px;
        right: 0;
        z-index: 1;
        background: linear-gradient(to top, transparent 0%, white 30%);
        padding: 10px 15px;
        display: flex;
        justify-content: space-between;
    }
    .table-header__add {
        margin-right: 20px;
    }
    .el-pagination {
        flex: 1;
    }
    .el-table >>> .cell {
        word-break: normal;
    }
    .el-collapse {
        width: 200px;
        border: none;
    }
    .el-collapse >>> .el-collapse-item__header {
        height: unset;
        line-height: 30px;
        border-bottom: none;
    }
    .el-collapse >>> .el-collapse-item__arrow {
        margin-right: 0;
        line-height: 30px;
    }
    .el-collapse >>> .el-collapse-item__wrap {
        border-bottom: none;
    }
    .el-collapse >>> .el-collapse-item__content {
        padding-bottom: 0;
    }
</style>