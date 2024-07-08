import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,

    state : {
        //to change you need to invoke mutationss
        token: null,
        user: null,
        isUserLoggedIn: false
    },
    //to invoke this an action must be changed
    mutations: {
        setToken (state, token){
            state.token = token
            if (token) {
                state.isUserLoggedIn = true
            } else {
                state.isUserLoggedIn = false
            }
        },
        setUser (state, user) {
            //async logic
            state.user = user
        }
    },
    //action in components
    actions: {
        setToken ({commit}, token) {
            //async logic
            commit('setToken', token) 
        },
        setUser ({commit}, user) {
            //async logic
            commit('setUser', user) 
        }
    }

})