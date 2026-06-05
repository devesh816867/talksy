import axios from "axios"

const instance = axios.create({
    baseURL :"https://talksy-zm1t.onrender.com/api",
})

export default instance
