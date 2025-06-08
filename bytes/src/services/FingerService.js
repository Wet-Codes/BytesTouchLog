import fingerprintAPI from '../services/ApiFinger';

export default {

  enrollFingerprint() {
    return fingerprintAPI.post('/enroll') // no data sent
      .then(response => response.data)
      .catch(error => {
        console.error('[Fingerprint Middleware Error]', error.response?.data || error.message);
        throw error;
      });
  }

};
