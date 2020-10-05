<template>
    <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button v-b-toggle.accordion-1 class="button" variant="info">Accordion 1</b-button>
        </b-card-header>
        <b-collapse id="accordion-1" accordion="game-history" role="tabpanel">
            <b-card-body>
                TEXT
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
    }
}
</script>

<style scoped>

.button {
    width: 100%;
}

</style>