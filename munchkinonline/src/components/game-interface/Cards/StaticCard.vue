<template>
    <b-card class="gray mb-1" v-bind:class="{'vertical': vertical}">
    </b-card>
</template>

<script>
import {BCard} from 'bootstrap-vue'

export default {
    name: 'StaticCard',
    props: ["vertical"],
    components: {
        BCard
    }
}
</script>

<style scoped>
    .gray { 
    background-color: gray;
    width: 8vh;
    height: 10vh;
    }

    .vertical {
        transform: rotate(90deg);
    }
</style>