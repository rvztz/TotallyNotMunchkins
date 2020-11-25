<template>
    <div id="signup">
        <Card id="card" v-bind:cardData="cardData" v-on:signup="signUpMethod"/>
        <div id="rest">
        </div>
    </div>
</template>

<script>
import Card from '../components/site-interface/Card'
import firebase from 'firebase'; 
import { userCollection } from '../main.js';

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
                        placeholder: "Email"
                    },
                    {
                        id:101,
                        placeholder: 'Username'
                    },
                    {
                        id: 102,
                        placeholder: "Password"
                    },
                    {
                        id: 103,
                        placeholder: "Confirm Password"
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
                alert('Los campos están vacíos'); 
            } else if (!validatePasswords(data)) {
                //diplay modal =>  password not equal  
                alert('Las contraseñas no coinciden');
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
                    alert(error.message); 
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