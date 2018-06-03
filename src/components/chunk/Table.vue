<template>
    <div>
        <el-table
            :data="tableData"
            stripe>
            <el-table-column
                type="index">
            </el-table-column>
            <el-table-column
                min-width="20"
                prop="name"
                label="Название">
            </el-table-column>
            <el-table-column
                min-width="80"
                prop="description"
                label="Описание">
            </el-table-column>
            <el-table-column
                v-if="allowEdit" 
                min-width="20"
                label="Действия">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="primary"
                        @click="update(scope.$index, scope.row)">Edit</el-button>
                </template>
            </el-table-column>
        </el-table>

        <Dialog 
            :visibleInitial.sync="dialogVisible"
            :id="id"
            @updaterow="updaterow"></Dialog>
    </div>
</template>

<script>
    import {HTTP} from '@/helpers/http'
    import Dialog from '@/components/chunk/Dialog'
    
    export default {
        name: 'Table',
        components: {
            Dialog,
        },
        data() {
            return {
                tableData: [],
                id: 0, // id текущей записи
                rowIndex: 0, // id текущей строки
                dialogVisible: false,
            }
        },
        computed: {
            allowEdit: function() { return this.checkPerm('chunk_edit') },
        },
        methods: {
            update: function(index, row) {
                this.id = row.id
                this.rowIndex = index
                this.dialogVisible = true
            },
            load: function() {
                HTTP.post('Chunk/Getlist')
                .then(response => {
                    this.tableData = response;
                })
            },
            /**
             * обновляет название чанка в таблице, новое имя приходит из диалога
             */
            updaterow: function(name) {
                this.tableData[this.rowIndex].name = name
            },
        },
        created() {
            this.load()
        },
    };
</script>

<style scoped>
    .el-table >>> .cell {
        white-space: nowrap;
    }
</style>