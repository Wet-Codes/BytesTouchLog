import { createStore } from 'vuex';

const store = createStore({
    state: {
        user: null,
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
    },
    actions: {
        setUser({ commit }, user) {
            commit('setUser', user);
        },
    },
    getters: {
        isAuthenticated(state) {
            return !!state.user;
        },
    },
});

export default store;