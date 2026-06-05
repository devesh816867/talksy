import React, {useState} from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "../utils/axios"
import {useAuth} from "../context/AuthContext"

function Login(){
    const [form, setForm] = useState({email:"",password:""})
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const {login} = useAuth()

    const handleChange = (e)=>{
        setForm({...form, [e.target.name]:e.target.value})
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try{
            const res = await axios.post("/auth/login", form)
            login(res.data.user, res.data.token)
            navigate("/chat")
        }catch(err){
            setError(err.response.data.message)
        }
    }

    return(
        <div className = "min-h-screen bg-[#0e1621] flex items-center justify-center">
            <div className="bg-[#17212b] p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-4xl font-bold text-center text-[#2aabee] mb-2">Talksy</h1>
                <h2 className="text-xl text-center text-gray-400 mb-6">Welcome Back</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={handleChange}
                      className="bg-[#242f3d] text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#2aabee]"
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={handleChange}
                      className="bg-[#242f3d] text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#2aabee]"
                    />

                    <button type="submit" className="bg-[#2aabee] hover:bg-[#1d96d4] text-white font-semibold py-3 rounded-xl transition duration-200">Login</button>
                </form>

                <p className="text-gray-400 text-center mt-6 text-sm">
                    Don't have an account?{" "}
                    <Link to ="/register" className="text-[#2aabee] hover:underline">
                    Register</Link>
                </p>
            </div>
        </div>
    )
}

export default Login