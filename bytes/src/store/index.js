import { createStore } from 'vuex';
import Api from '@/services/Api';

export default createStore({
  state: {
    user: null,
    token: localStorage.getItem('token') || null
  },
  mutations: {
    SET_USER(state, { user, token }) {
      state.user = user;
      state.token = token;
      localStorage.setItem('token', token);
    },
    CLEAR_USER(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await Api.post('/', credentials);
        commit('SET_USER', {
          user: response.data.user,
          token: response.data.token
        });
        return response;
      } catch (error) {
        commit('CLEAR_USER');
        throw error;
      }
    },

    async initializeAuth({ commit }) {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await Api.get('/api/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      },
      params: {
        _: Date.now() // Bypass cache with timestamp
      }
    });
        
       if (response.data && response.data.id) {
      commit('SET_USER', {
        user: response.data,
        token: token
      });
    } else {
      throw new Error('Invalid user data');
    }
      } catch (error) {
        commit('CLEAR_USER');
        console.error('Token validation failed:', error);
      }
    },

    logout({ commit }) {
      commit('CLEAR_USER');
       window.location.reload();
    }
  },
  
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    userRole: state => state.user?.role || 'user'
  }
});