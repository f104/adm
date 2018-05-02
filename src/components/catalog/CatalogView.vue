<template>
    <el-tabs>
        <el-tab-pane label="Автомобили">
            <TreeCars></TreeCars>
        </el-tab-pane>
        <el-tab-pane label="Категории и элементы">
            <TreeElements :increases="increases"></TreeElements>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import {HTTP} from '@/helpers/http'
    import TreeCars from '@/components/catalog/TreeCars'
    import TreeElements from '@/components/catalog/TreeElements'
    
    export default {
        components: {
            TreeCars,
            TreeElements,
        },
        data() {
            return {
                increases: [], // уровни наценки для элементов
            }
        },
        created() {
            HTTP.post('Increase/Getlist', {
                select: ['id', 'increase']
            })
            .then(response => {
                for (let i = 0; i < response.length; i++) {
                    this.increases.push({
                        id: parseInt(response[i].id),
                        increase: response[i].increase
                    })
                }
            })
        }
    };
</script>

<style>
    .custom-tree-node {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>