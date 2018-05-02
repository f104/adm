<template>
    <div>
        <el-button 
            type="primary" size="medium" 
            v-if="allowEdit" @click="create()">Новая категория</el-button>
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
                        v-if="allowEdit && node.level < 2"
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

        <DialogCategory
            :visibleInitial.sync="dialogVisible['category']"
            :id="id" @updatetree="reloadTree"></DialogCategory>
        <DialogElement 
            :visibleInitial.sync="dialogVisible['element']"
            :id="id" :category_id="parent" :increases="increases"
            :prepend="prepend" @updatetree="reloadNode"></DialogElement>
    </div>
</template>

<script>
    import {HTTP} from '@/helpers/http'
    import DialogCategory from '@/components/catalog/DialogCategory'
    import DialogElement from '@/components/catalog/DialogElement'
    
    export default {
        name: 'TreeElements',
        components: {
            DialogCategory,
            DialogElement,
        },
        props: {
            increases: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                id: 0, // id текущей записи
                parent: 0, // родитель текущей записи для элемента
                key: null, // ключ дерева, который нужно обновить после сохранения
                prepend: '', // prepend для формы редактирования элемента
                treeVisible: true, // ключ видимости для перезагрузки дерева
                dialogVisible: {
                    category: false,
                    element: false,
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
                var type = 'category'
                if (node) {
                    switch (node.level) {
                        case 1:
                            this.prepend = node.data.label
                            type = 'element'
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
                        // element
                        this.prepend = node.parent.data.label
                        this.key = node.parent.key
                        break;
                }
                this.id = data.id
                this.dialogVisible[data.type] = true
            },
            loadNode: function(node, resolve) {
                if (node.level === 0) {
                    // marks
                    HTTP.post('Cars/Category/Getlist', {
                        select: ['id', 'name']
                    })
                    .then(response => {
                        let data = []
                        for (let i = 0; i < response.length; i++) {
                            data.push({
                                type: 'category',
                                id: response[i].id,
                                label: response[i].name,
                                key: 'mark' + response[i].id,
                            })
                        }
                        return resolve(data);
                    })
                }
                if (node.level === 1) {
                    // elements
                    HTTP.post('Cars/Element/Getlist', {
                        select: ['id', 'name'],
                        where: {category_id: node.data.id},
                    })
                    .then(response => {
                        return resolve(this.formatElements(response));
                    })
                }
                if (node.level === 2) {
                    return resolve([]);
                }
            },
            formatElements: function(response) {
                var data = []
                for (var i = 0; i < response.length; i++) {
                    data.push({
                        type: 'element',
                        id: response[i].id,
                        label: response[i].name,
                        key: 'element' + response[i].id,
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
                        // elements
                        HTTP.post('Cars/Element/Getlist', {
                            select: ['id', 'name'],
                            where: {category_id: node.data.id},
                        })
                        .then(response => {
                            this.$refs.tree.updateKeyChildren(this.key, this.formatElements(response));
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
                        case 1: type = 'Category'; break
                        case 2: type = 'Element'; break
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
            },
        },
    };
</script>
