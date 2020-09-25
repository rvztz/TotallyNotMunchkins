<template>
    <div id="signup">
        <Card v-bind:cardData="cardData" v-on:btn-click="signUpMethod"/>
    </div>
</template>

<script>
import Card from '../components/site-interface/Card'

export default {
    name: 'signup',
    components: {
        Card
    },
    data () {
        return {
            cardData: {
                title: "Sign Up",
                textFields: [
                    {
                        id: 100,
                        placeholder: "Username"
                    },
                    {
                        id: 101,
                        placeholder: "Password"
                    },
                    {
                        id: 102,
                        placeholder: "Confirm Password"
                    }
                ],
                buttons: [
                    {
                        id: 201,
                        buttonText: "Sign Up"
                    }
                ],
                footerLink : {
                    display: true,
                    route: "/",
                    text: "Already have an account?"
                }
            }
        }
    },
    methods: {
        //data = ["username", "password", "confirm password"]
        signUpMethod(data) {
            // Sign in function here
            console.log(data);
        }
    }
}
</script>

<style scoped>
#signup {
    display: flex;
    justify-content: center;
}

.elem {
    padding-top: 10px;
}

</style>