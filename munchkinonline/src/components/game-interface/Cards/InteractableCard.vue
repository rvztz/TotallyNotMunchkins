<template>
    <b-card class="gray mb-1 mr-2 ml-2">
    </b-card>
</template>

<script>
import {BCard} from 'bootstrap-vue'

export default {
    name: 'InteractableCard',
    components: {
        BCard
    }
}
</script>

<style scoped>
    .gray { 
        background-color: gray;
        min-width: 8vh;
        min-height: 10vh;
    }
</style>