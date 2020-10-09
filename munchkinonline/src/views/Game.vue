<template>
<div>
    <b-container fluid class="text-center container-fluid" style="height: 300px">
        <b-row class="h-10">
            <b-col></b-col>
            <b-col cols="8"><OppositeHand /></b-col>
            <b-col></b-col>
        </b-row>

        <b-row class="h-80">
            <b-col cols="1"><VerticalHand ref="verticalHands" v-bind:vertical="true"/></b-col>
            <b-col cols="10"></b-col>
            <b-col cols="1"><VerticalHand ref="verticalHands" v-bind:vertical="true"/></b-col>
        </b-row>

        <b-row class="h-10">
            <b-col></b-col>
            <b-col cols="8"><PlayerHand /></b-col>
            <b-col></b-col>
        </b-row>
    </b-container>
</div>

</template>

<script>
import {BContainer, BRow, BCol} from 'bootstrap-vue'
import PlayerHand from '../components/game-interface/Hands/PlayerHand.vue'
import VerticalHand from '../components/game-interface/Hands/VerticalHand.vue'
import OppositeHand from '../components/game-interface/Hands/OppositeHand.vue'

export default {
    name: 'game',
    components: {
        BContainer,
        BRow,
        BCol,
        PlayerHand,
        VerticalHand,
        OppositeHand
    },
}

</script>

<style scoped>

</style>