<template>
    <el-dialog :visible.sync="visible"
        @open="get" @close="reset">
        <span slot="title">{{ title }}</span>
        <el-form :model="fields" :rules="rules" :disabled="formDisabled"
            @submit.prevent="submit" 
            label-position="right" label-width="155px" ref="elementForm">
            <el-alert v-for="error in errors"
                :title="error"
                type="error"
                show-icon
                :closable="false"></el-alert>
            <el-form-item label="Название" prop="name">
                <el-input v-model="fields.name" :autofocus="true">
                    <template slot="prepend">{{ prepend }}</template>
                </el-input>
            </el-form-item>
            <el-form-item label="Стоимость доставки" prop="increase_category_id">
                <el-select v-model="fields.increase_category_id" placeholder="Select">
                    <el-option
                        v-for="item in increases"
                        :key="item.id"
                        :label="item.increase"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Код" v-if="id != 0">
                <el-input v-model="fields.key" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="category_id" v-if="false">
                <el-input v-model="fields.category_id"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submit">Сохранить</el-button>
            <el-button @click="reset">Отмена</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {HTTP} from '@/helpers/http'
    export default {
        name: 'DialogElement',
        props: {
            visibleInitial: {
                type: Boolean,
                required: true
            },
            id: {
//                type: Number,
                required: true
            },
            category_id: {
//                type: Number,
                required: true
            },
            prepend: {
                type: String,
                required: true
            },
            increases: {
                type: Array,
                required: true
            }
        },
        methods: {
            get() {
                this.fields = {
                    ...this.defaultFields
                }
                this.errors = []
                if (this.id != 0) {
                    HTTP.post('Cars/Element/Get', {
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
                    this.fields.category_id = this.category_id
                    this.formDisabled = false
                }
            },
            reset() {
                this.visible = false
                this.formDisabled = true
                this.$refs['elementForm'].resetFields()
            },
            submit() {
                this.$refs['elementForm'].validate((valid) => {
                    if (valid) {
                        delete this.fields.model_key
                        HTTP.post('Cars/Element/Update', {
                            id: this.id, fields: this.fields
                        })
                        .then(response => {
                            this.errors = response.errors
                            if (this.errors.length == 0) {
                                this.reset()
                                this.$emit('updatetree')
                            }
                        })
                    } else {
                        return false
                    }
                });
            },
        },
        computed: {
            visible: {
                get: function () {
                    return this.visibleInitial
                },
                set: function (newValue) {
                    this.$emit('update:visibleInitial', newValue)
                }
            },
            title: function() {
                return this.id == 0 ? 'Новый элемент' : 'Редактируем элемент'
            },
        },
        data() {
            return {
                formDisabled: true,
                fields: {},
                defaultFields: {
                    category_id: null,
                    key: null,
                    increase_category_id: null,
                    name: '',
                },
                errors: [],
                rules: {
                    name: [
                        {type: 'string', required: true, trigger: 'blur'}
                    ],
                    increase_category_id: [
                        {required: true, trigger: 'blur'}
                    ],
                },
            }
        },
    }
</script>