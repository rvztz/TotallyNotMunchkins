<template>
    <div id="signup">
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
        <Card id="card" v-bind:cardData="cardData" v-on:signup="signUpMethod"/>
        <div id="rest">
        </div>
    </div>
</template>

<script>
import Card from '../components/site-interface/Card'
import firebase from 'firebase'; 
import { userCollection } from '../main.js';
import swal from 'sweetalert'

function validateFields(data)  {
    return ((data[0].replace(/\s/g,"") == "") && (data[1].replace(/\s/g,"") == "") && (data[2].replace(/\s/g,"") == "") && (data[3].replace(/\s/g,"") == ""));
}

function validatePasswords(data) {
    return (data[2] === data[3]);
}

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
                        placeholder: "E-mail",
                        type: "text"
                    },
                    {
                        id:101,
                        placeholder: 'Username',
                        type: "text"
                    },
                    {
                        id: 102,
                        placeholder: "Password",
                        type: "password"
                    },
                    {
                        id: 103,
                        placeholder: "Confirm Password",
                        type: "password"
                    }
                ],
                buttons: [
                    {
                        id: 201,
                        buttonText: "Sign Up",
                        eventName: "signup"
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
        signUpMethod(data) {
            // Sign in function here
            if(validateFields(data)) {
                //display modal => empty fields
                swal("Oops!", "One or more fields are empty", "error"); 
            } else if (!validatePasswords(data)) {
                //diplay modal =>  password not equal  
                swal("Oops!", "Passwords don't match", "error");
            } else {
                firebase.auth().createUserWithEmailAndPassword(
                    data[0], data[2]
                ).then((res)=> {
                    res.user.updateProfile({
                        displayName: data[1]
                    })
                    .then( () => {
                        this.$router.push('/profile')
                        this.addUserToCollection(data);
                    }); 
                }).catch((error) => {
                    swal("Oops!", error.message, "error"); 
                });
            }
        },
        addUserToCollection(user) {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;

            userCollection.add({
                email: user[0],
                name: user[1],
                joined: today
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        }
    }
}; 
</script>

<style scoped>
#card {
    margin: 20px auto 50px auto;
}

#rest {
    padding-bottom: 166px;
}

</style>