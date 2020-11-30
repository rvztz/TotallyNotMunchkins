<template>
    <div id="signin">
        <div id="nav">
            <div id="title">
                Munchkin Online 
            </div>
            <div id="navBar">
                <span> <router-link to="/about">About</router-link> | </span>
                <span> <router-link to="/">Sign In</router-link> | </span>
                <span> <router-link to="/signup">Sign Up</router-link> </span>
            </div>
        </div>
        <div id="line" />
        <Card id="card" v-bind:cardData="cardData" v-on:login="signInMethod"/>
        <div id="rest">
        </div>
    </div>
</template>

<script>
import Card from '../components/site-interface/Card'
import firebase from 'firebase'; 
import swal from 'sweetalert'

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
                        placeholder: "E-mail",
                        type: "text"
                    },
                    {
                        id: 101,
                        placeholder: "Password",
                        type: "password"
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
                swal("Oops", "One or more fields are empty", "error");
            } else {
                firebase.auth().signInWithEmailAndPassword(
                    data[0], data[1]
                ).then( () => {
                    this.$router.push('/profile'); 
                }).catch((error) => {
                    swal("Oops", error.message, "error"); 
                }); 
            }
        },
        redirectUser() {
            if (localStorage.getItem("userName")) {
                this.$router.push("/profile")
            }
        }
    },
    mounted() {
        this.redirectUser()
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