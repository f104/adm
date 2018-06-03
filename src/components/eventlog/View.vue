<template>
    <div>
        <Table :className="className" :columns="columns"></Table>
    </div>
</template>

<script>
    import Table from '@/components/Table'
    export default {
        components: {
            Table
        },
        data() {
            return {
                className: 'EventLog',
                columns: [{
                        prop: 'timestamp',
                        label: 'Дата/время',
                        gridShow: true,
                    },{
                        prop: 'user_name',
                        label: 'Пользователь',
                        gridShow: true,
                    },{
                        prop: 'user_email',
                        label: 'Email',
                        gridShow: true,
                    },{
                        prop: 'category',
                        label: 'Категория',
                        gridShow: true,
                    },{
                        prop: 'subject_id',
                        label: 'ID объекта',
                        gridShow: true,
                    },{
                        prop: 'message',
                        label: 'Действие',
                        html: true,
                        gridShow: true,
                    }],
//                filters: [{
//                        prop: 'category',
//                        label: 'Категория',
//                    },{
//                        prop: 'user_id',
//                        label: 'Пользователь'
//                    }]
            }
        }
    }
</script>