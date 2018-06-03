<template>
    <div>
        <Table 
            :className="className" 
            :allowEdit="allowEdit"
            :allowRemove="allowRemove"
            :columns="columns"
            :help="help"
            @update:id="update" 
            @remove:row="remove" 
            ref="table"
        ></Table>
        <el-dialog 
            :visible.sync="dialogVisible"
            @open="get" @close="reset">
            <span slot="title">Редактируем {{ dialogTitle }}</span>
            <el-form :model="fields" :rules="rules" :disabled="formDisabled"
                @submit.prevent="submit" 
                label-position="right" :label-width="dialogLabelWidth" ref="form">
                <el-alert v-for="error in errors"
                    :title="error"
                    type="error"
                    show-icon
                    :closable="false"></el-alert>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="Регион" prop="region_id">
                            <Combo
                                v-model="fields['region_id']"
                                className="Region"
                            ></Combo>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="Город" prop="city_id">
                            <Combo
                                v-model="fields['city_id']"
                                className="City"
                                label="выберите или создайте новый"
                                :allowCreate="true"
                                whereProp="region_id" :whereValue="fields['region_id']"
                            ></Combo>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="Почтовый индекс" prop="post_index">
                    <el-input v-model="fields['post_index']" @keyup.enter.native="submit"></el-input>
                </el-form-item>
                <el-form-item label="Адрес" prop="address">
                    <el-input v-model="fields['address']" @keyup.enter.native="submit"></el-input>
                </el-form-item>
                <el-form-item label="Телефон" prop="phone">
                    <el-input v-model="fields['phone']" @keyup.enter.native="submit"></el-input>
                </el-form-item>
                <el-form-item label="Режим работы">
                    <el-input type="textarea" v-model="fields['timework']"
                        :autosize="{ minRows: 1, maxRows: 10}"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="Широта" prop="latitude">
                            <el-input v-model.number="fields['latitude']" @keyup.enter.native="submit"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="Долгота" prop="longitude">
                            <el-input v-model.number="fields['longitude']" @keyup.enter.native="submit"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="Опубликован" prop="published">
                    <el-switch v-model="fields['published']"></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit">Сохранить</el-button>
                <el-button @click="reset">Отмена</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {HTTP} from '@/helpers/http'
    import Table from '@/components/Table'
    import Combo from '@/components/Combo'
    export default {
        components: {
            Table, Combo
        },
        data() {
            return {
                className: 'Office', // класс получаемого объекта
                columns: [{
                        prop: 'region_name',
                        label: 'Регион',
                    },{
                        prop: 'city_name',
                        label: 'Город',
                    },{
                        prop: 'phone',
                        label: 'Телефон',
                    },{
                        prop: 'published',
                        label: 'Опубликован',
                        html: true,
                        type: 'boolean',
                        gridShow: true,
                    }],
                help: 'Список представительств. Отображается в "контактах". Влияет на расчет цены (поле регион).\n\
                        Неопубликованные не показываются. Кешируются, поэтому после внесения изменений нужно Очистить кеш".',
                dialogTitle: 'офис',
                dialogLabelWidth: '130px',
                dialogVisible: false,
                id: 0, // id текущей записи
                formDisabled: true,
                fields: {},
                defaultFields: {
                    region_id: '',
                    city_id: '',
                    post_index: '',
                    address: '',
                    phone: '',
                    timework: '',
                    latitude: 0,
                    longitude: 0,
                    published: true,
                },
                errors: [],
                rules: {
                    region_id: [{
                        type: 'number',
                        required: true,
                        trigger: 'blur',
                    }],
                    post_index: [{
                        type: 'string',
                        max: 6,
                        trigger: 'blur',
                    }],
                    address: [{
                        type: 'string',
                        required: true,
                        trigger: 'blur',
                    }],
                    phone: [{
                        type: 'string',
                        required: true,
                        trigger: 'blur',
                    }],
                    latitude: [{
                        type: 'number',
                        trigger: 'blur',
                    }],
                    longitude: [{
                        type: 'number',
                        trigger: 'blur',
                    }],
                },
            }
        },
        methods: {
            update(id) {
                this.id = id
                this.dialogVisible = true
            },
            get() {
                this.fields = {
                    ...this.defaultFields
                }
                this.errors = []
                if (this.id != 0) {
                    HTTP.post(`${this.className}/Get`, {
                        id: this.id
                    })
                    .then(response => {
                        if (response === null) {
                            this.reset()
                        } else {
                            this.formDisabled = false
                            for (var f in response) {
                                if (this.fields.hasOwnProperty(f)) {
                                    this.fields[f] = response[f]
                                }
                            }
                        }
                    })
                } else {
                    this.formDisabled = false
                }
            },
            reset() {
                this.dialogVisible = false
                this.formDisabled = true
                this.$refs['form'].resetFields()
            },
            submit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        HTTP.post(`${this.className}/Update`, {
                            id: this.id, fields: this.fields
                        })
                        .then(response => {
                            this.errors = response.errors
                            if (this.errors.length == 0) {
                                this.reset()
                                this.$refs['table'].load()
                            }
                        })
                    } else {
                        return false
                    }
                });
            },
            remove: function(row) {
                this.$confirm('Подтведите удаление (необратимо)', `Удаляем ${row.address}`, {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    HTTP.post(`${this.className}/Remove`, {
                        id: row.id,
                    }).then(response => {
                        if (response === true) {
                            this.$refs['table'].load()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Отменено'
                    });          
                });
            },
        },
        computed: {
            allowEdit: function() { return this.checkPerm('office_edit') },
            allowRemove: function() { return this.checkPerm('office_remove') },
        },
    }
</script>

<style scoped>
    .el-select {
        display: block;
    }
</style>