import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import * as firebase from 'firebase';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue);

const firebaseConfig = {
  apiKey: "AIzaSyDxyyktWkqS_PSu2Ps-XzrjooDgOEHCCfI",
  authDomain: "munchkin-online-98a8b.firebaseapp.com",
  databaseURL: "https://munchkin-online-98a8b.firebaseio.com",
  projectId: "munchkin-online-98a8b",
  storageBucket: "munchkin-online-98a8b.appspot.com",
  messagingSenderId: "331219470811",
  appId: "1:331219470811:web:0915a81ac8039fe2ae3ffe",
  measurementId: "G-Y6SY7JYHK8"
};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var userCollection = db.collection("users");
var gameCollection = db.collection("games");

export {
  db,
  userCollection,
  gameCollection
}


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
