<template>
    <div class="content">
        <div class="table-header">
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
            <el-collapse class="test">
                <el-collapse-item title="Фильтры">
                    <el-select placeholder="Пользователь" 
                               clearable @change="handleFilter"
                               v-model="filter['user_id']" size="small">
                        <el-option v-for="item in filters.user_id" 
                                   :label="`${item.user_name} (${item.user_email})`" 
                                   :value="item.user_id"
                                   :key="item.user_id"></el-option>
                    </el-select>                            
                    <el-select placeholder="Категория" 
                               clearable @change="handleFilter"
                               v-model="filter['category']" size="small">
                        <el-option v-for="item in filters.category" 
                                   :label="item.category" 
                                   :value="item.category"
                                   :key="item.category"></el-option>
                    </el-select>
                </el-collapse-item>
            </el-collapse>            
        </div>
        <el-table
            :data="tableData"
            stripe>
            <el-table-column
                type="index"
                :index="indexMethod">
            </el-table-column>
            <el-table-column
                min-width="80"
                prop="timestamp"
                label="Дата/время">
            </el-table-column>
            <el-table-column
                min-width="80"
                prop="user"
                label="Пользователь">
                <template slot-scope="scope">
                    {{ scope.row.user_name }} <span class="nowrap">({{scope.row.user_email }})</span>
                </template>
            </el-table-column>
            <el-table-column
                min-width="80"
                prop="category"
                label="Категория">
            </el-table-column>
            <el-table-column
                min-width="80"
                prop="id"
                label="ID">
            </el-table-column>
            <el-table-column
                min-width="80"
                label="Действие">
                <template slot-scope="scope">
                    <span v-html="scope.row.message"></span>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    import {HTTP} from '@/helpers/http'

    export default {
        name: 'Table',
        data() {
            return {
                tableData: [],
                tableSizes: [20, 50, 100],
                tableSize: 50,
                tablePage: 1,
                tableTotal: 0,
                filters: {
                    category: [],
                    user_id: [],
                },
                filter: {
                    category: '',
                    user_id: '',
                },
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
                for (let key in this.filter) {
                    if (this.filter[key] !== '') {
                        where[key] = this.filter[key]
                    }
                }
                HTTP.post('EventLog/Getlist', {
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
                HTTP.post('EventLog/Getlist', {
                    select: ['category'],
                    distinct: true,
                })
                .then(response => {
                    this.filters.category = response.data
                })
                HTTP.post('EventLog/Getlist', {
                    select: ['user_id'],
                    distinct: true,
                })
                .then(response => {
                    this.filters.user_id = response.data
                })
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
    .el-select {
        display: block;
        margin-bottom: 10px;
    }
</style>