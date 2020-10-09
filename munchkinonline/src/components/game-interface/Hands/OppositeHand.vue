<template>
    <div>
        <b-card border-variant="dark">
            <div class="deck">
                <StaticCard />
                <StaticCard />
                <StaticCard />
                <StaticCard />
                <StaticCard />
            </div>
        </b-card>
    </div>
</template>

<script>
import {BCard} from 'bootstrap-vue'

export default {
    name: 'OppositeHand',
    components: {
        BCard
    }
}
</script>

<style scoped>

    .deck {
        display: flex;
    }

</style>