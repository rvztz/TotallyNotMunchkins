<template>
<div>
    <b-container fluid class="text-center container-fluid" style="height: 300px">
        <b-row class="h-10">
            <b-col></b-col>
            <b-col cols="8"><Hand /></b-col>
            <b-col></b-col>
        </b-row>

        <b-row class="h-80">
            <b-col id="leftHand" ref="verticalCols"><Hand ref="verticalHands"/></b-col>
            <b-col cols="8"></b-col>
            <b-col id="rightHand" ref="verticalCols"><Hand ref="verticalHands"/></b-col>
        </b-row>

        <b-row class="h-10">
            <b-col></b-col>
            <b-col cols="8"><Hand /></b-col>
            <b-col></b-col>
        </b-row>
    </b-container>
</div>

</template>

<script>
import {BContainer, BRow, BCol} from 'bootstrap-vue'
import Hand from '../components/game-interface/Hand.vue'

export default {
    name: 'game',
    components: {
        BContainer,
        BRow,
        BCol,
        Hand
    },
    mounted() {
        var cols = this.$refs.verticalCols
        var hands = this.$refs.verticalHands

        console.log(hands)

        cols.forEach((col, index) => {
            col.height = hands[index].width
        })
    }
}

</script>

<style scoped>
#leftHand {
    transform: rotate(90deg)
}

#rightHand {
    transform: rotate(-90deg)
}

</style>