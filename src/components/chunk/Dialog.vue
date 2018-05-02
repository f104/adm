<template>
    <el-dialog :visible.sync="visible"
        @open="get" @close="reset">
        <span slot="title">Редактируем чанк</span>
        <el-form :model="fields" :rules="rules" :disabled="formDisabled"
            @submit.prevent="submit" 
            label-position="right" label-width="90px" ref="chunkForm">
            <el-alert v-for="error in errors"
                :title="error"
                type="error"
                show-icon
                :closable="false"></el-alert>
            <el-form-item label="Название" prop="name">
                <el-input v-model="fields.name" :autofocus="true"></el-input>
            </el-form-item>
            <el-form-item label="Текст">
                <el-input type="textarea" v-model="fields.content"
                    :autosize="{ minRows: 4, maxRows: 10}"></el-input>
            </el-form-item>
        </el-form>
        <p v-html="description"></p>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submit">Сохранить</el-button>
            <el-button @click="reset">Отмена</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {HTTP} from '@/helpers/http'
    export default {
        name: 'Dialog',
        props: {
            visibleInitial: {
                type: Boolean,
                required: true
            },
            id: {
//                type: number,
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
                    HTTP.post('Chunk/Get', {
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
                            this.description = this.nl2br(response.description)
                        }
                    })
                } else {
                    this.formDisabled = false
                }
            },
            reset() {
                this.visible = false
                this.formDisabled = true
                this.$refs['chunkForm'].resetFields()
            },
            submit() {
                this.$refs['chunkForm'].validate((valid) => {
                    if (valid) {
                        HTTP.post('Chunk/Update', {
                            id: this.id, fields: this.fields
                        })
                        .then(response => {
                            this.errors = response.errors
                            if (this.errors.length == 0) {
                                let eventData = this.fields.name
                                this.reset()
                                this.$emit('updaterow', eventData)
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
        },
        data() {
            return {
                description: '',
                formDisabled: true,
                fields: {},
                defaultFields: {
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