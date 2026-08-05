<template>

<div class="row q-col-gutter-md">

    <div class="col-md-4 col-12">

        <q-input
            outlined
            dense
            label="Pesquisar chamado"
            prepend-icon="search"
        />

    </div>

    <div class="col-md-3 col-12">

        <q-select
            outlined
            dense
            label="Status"
            :options="status"
        />

    </div>

</div>

</template>

<script setup>

const status = [

'Todos',
'Aberto',
'Em andamento',
'Finalizado'

]

</script>