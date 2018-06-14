<template>
    <el-dialog :visible.sync="visible"
        @open="get" @close="reset">
        <span slot="title">{{ title }}</span>
        <el-form :model="fields" :rules="rules" :disabled="formDisabled"
            @submit.prevent="submit" 
            label-position="right" label-width="90px" ref="modelForm">
            <el-alert v-for="error in errors"
                :title="error"
                type="error"
                show-icon
                :closable="false"></el-alert>
            <el-form-item label="Название" prop="model_name">
                <el-input v-model="fields.model_name" :autofocus="true">
                    <template slot="prepend">{{ prepend }}</template>
                </el-input>
            </el-form-item>
            <el-form-item label="Title" prop="title">
                <el-input v-model="fields.title"></el-input>
            </el-form-item>
            <el-form-item label="Keywords" prop="keywords">
                <el-input v-model="fields.keywords"></el-input>
            </el-form-item>
            <el-form-item label="h1" prop="h1">
                <el-input v-model="fields.h1"></el-input>
            </el-form-item>
            <el-form-item label="Description" prop="description">
                <el-input v-model="fields.description"></el-input>
            </el-form-item>
            <el-form-item label="Текст">
                <el-input type="textarea" v-model="fields.content"
                    :autosize="{ minRows: 4, maxRows: 10}"></el-input>
            </el-form-item>
            <el-form-item label="Код" v-if="id != 0">
                <el-input v-model="fields.model_key" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="mark_id" v-if="false">
                <el-input v-model="fields.mark_id"></el-input>
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
        name: 'DialogModel',
        props: {
            visibleInitial: {
                type: Boolean,
                required: true
            },
            id: {
//                type: Number,
                required: true
            },
            mark_id: {
//                type: Number,
                required: true
            },
            prepend: {
                type: String,
                required: true
            },
        },
        methods: {
            get() {
                this.fields = {
                    ...this.defaultFields
                }
                this.errors = []
                if (this.id != 0) {
                    HTTP.post('Cars/Model/Get', {
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
                    this.fields.mark_id = this.mark_id
                    this.formDisabled = false
                }
            },
            reset() {
                this.visible = false
                this.formDisabled = true
                this.$refs['modelForm'].resetFields()
            },
            submit() {
                this.$refs['modelForm'].validate((valid) => {
                    if (valid) {
                        delete this.fields.model_key
                        HTTP.post('Cars/Model/Update', {
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
                return this.id == 0 ? 'Новая модель' : 'Редактируем модель '
            },
        },
        data() {
            return {
                formDisabled: true,
                fields: {},
                defaultFields: {
                    mark_id: null,
                    model_key: null,
                    model_name: '',
                    title: null,
                    keywords: null,
                    h1: null,
                    description: null,
                    content: null,
                },
                errors: [],
                rules: {
                    model_name: [
                        {type: 'string', required: true, trigger: 'blur'}
                    ],
                    title: [
                        {type: 'string', required: false, max: 500, trigger: 'blur'}
                    ],
                    keywords: [
                        {type: 'string', required: false, max: 500, trigger: 'blur'}
                    ],
                    h1: [
                        {type: 'string', required: false, max: 500, trigger: 'blur'}
                    ],
                    description: [
                        {type: 'string', required: false, max: 1000, trigger: 'blur'}
                    ],
                    content: [
                        {type: 'string', required: false, trigger: 'blur'}
                    ],
                },
            }
        },
    }
</script>