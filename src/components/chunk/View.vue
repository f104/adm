<template>
    <div>
        <el-alert type="info" title="">Чанки – блоки html-кода, вставляемые в шаблоны страниц. В описании чанка написано где он используется. 
            У чанка могут быть плейсхолдеры – динамически вычисляемые значения.</el-alert>
        <Table></Table>
    </div>
</template>

<script>
    import Table from '@/components/chunk/Table'
    
    export default {
        components: {
            Table,
        },
    };
</script>