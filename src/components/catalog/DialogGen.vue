<template>
    <el-dialog :visible.sync="visible"
        @open="get" @close="reset">
        <span slot="title">{{ title }}</span>
        <el-form :model="fields" :rules="rules" :disabled="formDisabled"
            @submit.prevent="submit" 
            label-position="right" label-width="115px" ref="genForm">
            <el-alert v-for="error in errors"
                :title="error"
                type="error"
                show-icon
                :closable="false"></el-alert>
            <el-form-item label="Название">
                <el-input v-model="fields.gen_name" :autofocus="true"
                          placeholder="Можно оставить пустым, название будет формироваться из годов выпуска">
                    <template slot="prepend">{{ prepend }}</template>
                </el-input>
            </el-form-item>
            <el-form-item label="Годы выпуска" prop="gen_start">
                <el-select placeholder="Начало производства" v-model="fields.gen_start">
                    <el-option v-for="year in yearsStart" 
                               :label="year.label" 
                               :value="year.value"
                               :key="year.value"></el-option>
                </el-select>                    
                <el-select placeholder="Окончание производства" v-model="fields.gen_finish">
                    <el-option v-for="year in yearsFinish" 
                               :label="year.label" 
                               :value="year.value"
                               :key="year.value"></el-option>
                </el-select>                    
            </el-form-item>
            <el-form-item label="Текст">
                <el-input type="textarea" v-model="fields.content"
                    :autosize="{ minRows: 4, maxRows: 10}"></el-input>
            </el-form-item>
            <el-form-item label="Код" v-if="id != 0">
                <el-input v-model="fields.gen_key" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="model_id" v-if="false">
                <el-input v-model="fields.model_id"></el-input>
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
        name: 'DialogGen',
        props: {
            visibleInitial: {
                type: Boolean,
                required: true
            },
            id: {
//                type: Number,
                required: true
            },
            model_id: {
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
                    HTTP.post('Cars/Gen/Get', {
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
                    this.fields.model_id = this.model_id
                    this.formDisabled = false
                }
            },
            reset() {
                this.visible = false
                this.formDisabled = true
                this.$refs['genForm'].resetFields()
            },
            submit() {
                this.$refs['genForm'].validate((valid) => {
                    if (valid) {
                        delete this.fields.gen_key
                        HTTP.post('Cars/Gen/Update', {
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
                return this.id == 0 ? 'Новое поколение' : 'Редактируем поколение'
            },
            yearsStart: function() {
                let date = new Date
                let currentYear = date.getFullYear()
                let years = []
                for (let i = currentYear; i >= 1900; i--) {
                    years.push({
                        value: i,
                        label: i,
                    })
                }
                return years
            },
            yearsFinish: function() {
                let years = []
                years = years.concat(this.yearsStart)
                years.unshift({
                    value: 0,
                    label: 'н.в.',
                })
                return years
            },
        },
        data() {
            return {
                formDisabled: true,
                fields: {},
                defaultFields: {
                    model_id: null,
                    gen_key: null,
                    gen_name: '',
                    gen_start: null,
                    gen_finish: 0,
                    content: null,
                },
                errors: [],
                rules: {
                    gen_start: [
                        {type: 'number', required: true, trigger: 'blur'}
                    ],
                },
            }
        },
    }
</script>