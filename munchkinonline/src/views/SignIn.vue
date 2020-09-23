<template>
    <div id="signin">
        <Card v-bind:cardData="cardData"/>
    </div>
</template>

<script>
import Card from '../components/site-interface/Card'

export default {
    name: 'signin',
    components: {
        Card
    },
    data () {
        return {
            cardData: {
                title: "Sign In",
                textFields: [
                    {
                        id: 0,
                        placeholder: "Username"
                    },
                    {
                        id: 1,
                        placeholder: "Password"
                    }
                ]
            }
        }
    }
}
</script>

<style scoped>
#signin {
    display: flex;
    justify-content: center;
}

.elem {
    padding-top: 10px;
}

</style>