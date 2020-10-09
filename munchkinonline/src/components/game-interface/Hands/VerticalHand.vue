<template>
    <div>
        <b-card border-variant="dark">
            <div class="deck">
                <StaticCard v-bind:vertical="vertical"/>
                <StaticCard v-bind:vertical="vertical"/>
                <StaticCard v-bind:vertical="vertical"/>
                <StaticCard v-bind:vertical="vertical"/>
                <StaticCard v-bind:vertical="vertical"/>
            </div>
        </b-card>
    </div>
</template>

<script>
import {BCard} from 'bootstrap-vue'
import StaticCard from '../Cards/StaticCard.vue'

export default {
    name: 'VerticalHand',
    props: ["vertical"],
    components: {
        BCard,
        StaticCard
    }
}
</script>

<style scoped>

</style>