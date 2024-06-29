import Api from '@/services/Api'

export default {
    login (credentials) {
        return Api().post('/', credentials)
    }
}


// AuthServices.register({
//  email: 'test@gmail.com'
//  password: '123456'
//})    