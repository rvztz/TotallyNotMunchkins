<template>
    <div id="signin">
        <Card id="card" v-bind:cardData="cardData" v-on:login="signInMethod"/>
        <div id="rest">
        </div>
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
                        buttonText: "Log In",
                        eventName: "login"
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
                    this.$router.push('/profile'); 
                }).catch((error) => {
                    alert(error.message); 
                }); 
            }
        }
    }
}
</script>

<style scoped>
#card {
    margin: 20px auto 50px auto;
}

#rest {
    padding-bottom: 292px;
}

.elem {
    padding-top: 10px;
}

</style>