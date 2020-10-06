<template>
    <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button v-b-toggle="entryData.id" class="button" variant="info">{{entryData.data.date}}</b-button>
        </b-card-header>
        <b-collapse v-bind:id="entryData.id" accordion="game-history" role="tabpanel">
            <b-card-body>
                {{entryData.data.usernames}}
            </b-card-body>
        </b-collapse>
    </b-card>
</template>

<script>
import {BCard, BButton, BCollapse} from 'bootstrap-vue'

export default {
    name: 'AccordionElement',
    components: {
        BCard,
        BButton,
        BCollapse
    },
    props: ["entryData"]
}
</script>

<style scoped>

.button {
    width: 100%;
}

</style>