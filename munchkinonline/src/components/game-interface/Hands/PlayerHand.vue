<template>
    <div>
        <b-card border-variant="dark">
            <b-container fluid class="text-center container-fluid">
                <b-row>
                    <b-col cols="7">
                        <div class="deck">
                            <InteractableCard />
                            <InteractableCard />
                            <InteractableCard />
                            <InteractableCard />
                            <InteractableCard />
                            <InteractableCard />
                        </div>
                    </b-col>
                    <b-col cols="5">
                        <div class="equipment">
                            <!---EQUIPMENT COMPONENT--->
                        </div>
                    </b-col>
                </b-row>
            </b-container>
        </b-card>
    </div>
</template>

<script>
import {BCard, BContainer, BRow, BCol} from 'bootstrap-vue'
import InteractableCard from '../Cards/InteractableCard.vue'

export default {
    name: 'PlayerHand',
    components: {
        BCard,
        BContainer,
        BRow,
        BCol,
        InteractableCard
    }
}
</script>

<style scoped>
.deck {
    display: flex;
    flex-wrap: wrap;
    border-right: 2px solid gray;
}

.equipment {
    display: flex;
    flex-wrap: wrap;
}
</style>