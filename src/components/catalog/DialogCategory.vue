<template>
    <el-dialog :visible.sync="visible"
        @open="get" @close="reset">
        <span slot="title">{{ title }}</span>
        <el-form :model="fields" :rules="rules" :disabled="formDisabled"
            @submit.prevent="submit" 
            label-position="right" label-width="90px" ref="categoryForm">
            <el-alert v-for="error in errors"
                :title="error"
                type="error"
                show-icon
                :closable="false"></el-alert>
            <el-form-item label="Название" prop="name">
                <el-input v-model="fields.name" :autofocus="true"></el-input>
            </el-form-item>
            <el-form-item label="Код" v-if="id != 0">
                <el-input v-model="fields.key" :disabled="true"></el-input>
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
        name: 'DialogCategory',
        props: {
            visibleInitial: {
                type: Boolean,
                required: true
            },
            id: {
//                type: Number,
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
                    HTTP.post('Cars/Category/Get', {
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
                this.visible = false
                this.formDisabled = true
                this.$refs['categoryForm'].resetFields()
            },
            submit() {
                this.$refs['categoryForm'].validate((valid) => {
                    if (valid) {
                        delete this.fields.key
                        HTTP.post('Cars/Category/Update', {
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
                return this.id == 0 ? 'Новая категория' : 'Редактируем категорию'
            },
        },
        data() {
            return {
                formDisabled: true,
                fields: {},
                defaultFields: {
                    key: null,
                    name: null,
                    content: null,
                },
                errors: [],
                rules: {
                    name: [
                        {type: 'string', required: true, trigger: 'blur'}
                    ],
                },
            }
        },
    }
</script>