<template>
    <el-dialog :visible.sync="visible"
        @open="get" @close="reset">
        <span slot="title">{{ title }}</span>
        <el-form :model="fields" :rules="rules" :disabled="formDisabled"
            @submit.prevent="submit" 
            label-position="right" label-width="90px" ref="markForm">
            <el-alert v-for="error in errors"
                :title="error"
                type="error"
                show-icon
                :closable="false"></el-alert>
            <el-form-item label="Название" prop="mark_name">
                <el-input v-model="fields.mark_name" :autofocus="true"></el-input>
            </el-form-item>
            <el-form-item label="Текст">
                <el-input type="textarea" v-model="fields.content"
                    :autosize="{ minRows: 4, maxRows: 10}"></el-input>
            </el-form-item>
            <el-form-item label="Код" v-if="id != 0">
                <el-input v-model="fields.mark_key" :disabled="true"></el-input>
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
        name: 'DialogMark',
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
                    HTTP.post('Cars/Mark/Get', {
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
                this.$refs['markForm'].resetFields()
            },
            submit() {
                this.$refs['markForm'].validate((valid) => {
                    if (valid) {
                        delete this.fields.mark_key
                        HTTP.post('Cars/Mark/Update', {
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
                return this.id == 0 ? 'Новая марка' : 'Редактируем марку '
            },
        },
        data() {
            return {
                formDisabled: true,
                fields: {},
                defaultFields: {
                    mark_key: null,
                    mark_name: null,
                    content: null,
                },
                errors: [],
                rules: {
                    mark_name: [
                        {type: 'string', required: true, trigger: 'blur'}
                    ],
                    content: [
                        {type: 'string', required: false, trigger: 'blur'}
                    ],
                },
            }
        },
    }
</script>