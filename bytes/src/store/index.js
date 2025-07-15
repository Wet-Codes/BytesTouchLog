import { createStore } from 'vuex';
import Api from '@/services/Api';
import { getClientIP } from '@/services/ipService'; // Create this utility

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
        console.log('Login response:', response);
        
        if (response.data && response.data.user && response.data.token) {
  commit('SET_USER', {
    user: response.data.user,
    token: response.data.token
  });
} else {
  console.error('Unexpected login response format:', response.data);
  throw new Error('Invalid login response');
}
         // ADDED: Record login history
        try {
          // Get device info
            const deviceInfo = {
      ip: await getClientIP(), // Get client IP
      device: navigator.userAgent // Raw user agent string
    };
          
          // Record login event
          await Api.recordLogin(deviceInfo);
        } catch (historyError) {
          console.error('Failed to record login history:', historyError);
        }
            

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

    async logout({ commit, state, dispatch }) {
  try {
    if (state.token) {
      const deviceInfo = {
        ip: await dispatch('getClientIP'),
        device: navigator.userAgent
      };
      await Api.recordLogout(deviceInfo);
      await Api.logout();
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    commit('CLEAR_USER');
    window.location.reload(); // force reset app state
  }
},
    
    // ADDED: Get client IP address
    async getClientIP() {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
      } catch {
        return 'Unknown IP';
      }
    }
  },
  
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    userRole: state => state.user?.role || 'user'
  }
});