<template>
    <div>
        <el-button 
            type="primary" size="medium" 
            v-if="allowEdit" @click="create()">Новая марка</el-button>
        <p></p>
        <el-tree 
        ref="tree"
        v-if="treeVisible"
        :props="props"
        node-key="key"
        :expand-on-click-node="false"
        lazy
        :load="loadNode"
        :highlight-current="true">
        <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
                <el-button
                    v-if="allowEdit"
                    type="text"
                    size="mini"
                    @click="() => update(node, data)">
                    Редактировать
                </el-button>
                <el-button
                    v-if="allowEdit && node.level < 3"
                    type="text"
                    size="mini"
                    @click="() => create(node, data)">
                    Добавить
                </el-button>
                <el-button
                    v-if="allowRemove"
                    type="text"
                    size="mini"
                    @click="() => remove(node, data)">
                    Удалить
                </el-button>
            </span>
            </span>
    </el-tree>

        <DialogMark 
            :visibleInitial.sync="dialogVisible['mark']"
            :id="id" @updatetree="reloadTree"></DialogMark>
        <DialogModel 
            :visibleInitial.sync="dialogVisible['model']"
            :id="id" :mark_id="parent"
            :prepend="prepend" @updatetree="reloadNode"></DialogModel>
        <DialogGen 
            :visibleInitial.sync="dialogVisible['gen']"
            :id="id" :model_id="parent"
            :prepend="prepend" @updatetree="reloadNode"></DialogGen>
    </div>
</template>

<script>
    import {HTTP} from '@/helpers/http'
    import DialogMark from '@/components/catalog/DialogMark'
    import DialogModel from '@/components/catalog/DialogModel'
    import DialogGen from '@/components/catalog/DialogGen'
    
    export default {
        name: 'TreeCars',
        components: {
            DialogMark,
            DialogModel,
            DialogGen,
        },
        data() {
            return {
                id: 0, // id текущей записи
                parent: 0, // родитель текущей записи для модели и поколения
                key: null, // ключ дерева, который нужно обновить после сохранения
                prepend: '', // prepend для формы редактирования модели и поколения
                treeVisible: true, // ключ видимости для перезагрузки дерева
                dialogVisible: {
                    mark: false,
                    model: false,
                    gen: false,
                },
                props: {
                    label: 'label',
                    children: [],
                    isLeaf: 'leaf',
                },
            }
        },
        computed: {
            allowEdit: function() { return this.checkPerm('catalog_edit') },
            allowRemove: function() { return this.checkPerm('catalog_remove') },
        },
        methods: {
            create: function(node = null, data = null) {
                this.id = 0
                var type = 'mark'
                if (node) {
                    switch (node.level) {
                        case 1:
                            this.prepend = node.data.label
                            type = 'model'
                            break;
                        case 2:
                            this.prepend = `${node.parent.data.label} ${node.data.label}`
                            type = 'gen'
                            break;
                    }
                    this.parent = node.data.id
                    this.key = node.key
                }
                this.dialogVisible[type] = true
            },
            update: function(node, data) {
                switch (node.level) {
                    case 2:
                        // model
                        this.prepend = node.parent.data.label
                        this.key = node.parent.key
                        break;
                    case 3:
                        // gen
                        this.prepend = `${node.parent.parent.data.label} ${node.parent.data.label}`
                        this.key = node.parent.key
                        break;
                }
                this.id = data.id
                this.dialogVisible[data.type] = true
            },
            loadNode: function(node, resolve) {
                if (node.level === 0) {
                    // marks
                    HTTP.post('Cars/Mark/Getlist', {
                        select: ['id', 'mark_name']
                    })
                    .then(response => {
                        var data = []
                        for (var i = 0; i < response.length; i++) {
                            data.push({
                                type: 'mark',
                                id: response[i].id,
                                label: response[i].mark_name,
                                key: 'mark' + response[i].id,
                            })
                        }
                        return resolve(data);
                    })
                }
                if (node.level === 1) {
                    // models
                    HTTP.post('Cars/Model/Getlist', {
                        select: ['id', 'model_name'],
                        where: {mark_id: node.data.id},
                    })
                    .then(response => {
                        return resolve(this.formatModels(response));
                    })
                }
                if (node.level === 2) {
                    // generations
                    HTTP.post('Cars/Gen/Getlist', {
                        select: ['id', 'gen_name', 'gen_fullname', 'gen_start', 'gen_finish'],
                        where: {model_id: node.data.id},
                    })
                    .then(response => {
                        return resolve(this.formatGens(response));
                    })
                }
                if (node.level === 3) {
                    return resolve([]);
                }
            },
            formatModels: function(response) {
                var data = []
                for (var i = 0; i < response.length; i++) {
                    data.push({
                        type: 'model',
                        id: response[i].id,
                        label: response[i].model_name,
                        key: 'model' + response[i].id,
                    })
                }
                return data
            },
            formatGens: function(response) {
                var data = []
                for (var i = 0; i < response.length; i++) {
                    data.push({
                        type: 'gen',
                        id: response[i].id,
                        label: response[i].gen_fullname,
                        key: 'gen' + response[i].id,
                    })
                }
                return data
            },
            reloadTree: function() {
                this.treeVisible = false;
                this.$nextTick(() => {
                     this.treeVisible = true
                })
            },
            reloadNode: function() {
                var node = this.$refs.tree.getNode(this.key)
                switch (node.level) {
                    case 1:
                        // models
                        HTTP.post('Cars/Model/Getlist', {
                            select: ['id', 'model_name'],
                            where: {mark_id: node.data.id},
                        })
                        .then(response => {
                            this.$refs.tree.updateKeyChildren(this.key, this.formatModels(response));
                        })
                        break
                    case 2:
                        // gens
                        HTTP.post('Cars/Gen/Getlist', {
                            select: ['id', 'gen_name', 'gen_fullname', 'gen_start', 'gen_finish'],
                            where: {model_id: node.data.id},
                        })
                        .then(response => {
                            this.$refs.tree.updateKeyChildren(this.key, this.formatGens(response));
                        })
                        break
                }
            },
            remove: function(node, data) {
                this.$confirm('Подтведите удаление (необратимо)', `Удаляем ${node.label}`, {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    var type
                    switch (node.level) {
                        case 1: type = 'Mark'; break
                        case 2: type = 'Model'; break
                        case 3: type = 'Gen'; break
                    }
                    HTTP.post(`Cars/${type}/Remove`, {
                        id: data.id,
                    }).then(response => {
                        if (response === true) {
                            this.$refs.tree.remove(node)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Отменено'
                    });          
                });
            }
        },
    };
</script>