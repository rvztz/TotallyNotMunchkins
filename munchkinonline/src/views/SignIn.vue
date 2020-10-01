<template>
    <div id="signin">
        <Card v-bind:cardData="cardData" v-on:btn-click="signInMethod"/>
    </div>
</template>

<script>
import Card from '../components/site-interface/Card'
import firebase from 'firebase'; 

function validateFields(data)  {
    return ((data[0].replace(/\s/g,"") == "") || (data[1].replace(/\s/g,"") == "")); 
}

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
                        id: 100,
                        placeholder: "Username"
                    },
                    {
                        id: 101,
                        placeholder: "Password"
                    }
                ],
                buttons: [
                    {
                        id: 201,
                        buttonText: "Log In"
                    }
                ],
                footerLink : {
                    display: true,
                    route: "/signup",
                    text: "Don't have an account?"
                }
            }
        }
    },
    methods: {
        //data = ["username", "password"]
        signInMethod(data) {
            if(validateFields(data)) {
                alert('Uno o más campos están vacíos');
            } else {
                firebase.auth().signInWithEmailAndPassword(
                    data[0], data[1]
                ).then( () => {
                    this.$router.push('/home'); 
                }).catch((error) => {
                    alert(error.message); 
                }); 
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