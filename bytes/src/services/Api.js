import axios from 'axios'//Api Requests for front end

export default() => {
    return axios.create({
        baseURL:'http://localhost:2002'
    })
}