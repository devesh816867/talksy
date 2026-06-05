import React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "../utils/axios"

function Register(){
    const [form, setForm] = useState({username:"", email:"", password:""})
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleChange = (e)=>[
        setForm({...form, [e.target.name]: e.target.value})
    ]

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try{
            await axios.post("/auth/register", form)
            navigate("/login")
        }catch(err){
            setError(err.response.data.message)
        }
    }

    return(
      <div className="min-h-screen bg-[#0e1621] flex items-center justify-center">
        <div className="bg-[#17212b] p-8 rounded-2xl shadow-lg w-full max-w-md">
            <h1 className="text-4xl font-bold text-center text-[#2aabee] mb-2">Talksy</h1>
            <h2 className="text-xl text-center text-gray-400 mb-6">Create Account</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type ="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  className="bg-[#242f3d] text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#2aabee]"
                />
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
                <button
                  type = "submit"
                  className="bg-[#2aabee] hover:bg-[#1d96d4] text-white font-semibold py-3 rounded-xl transition duration-200"
                >Register</button>
            </form>

            <p className="text-gray-400 text-center mt-6 text-sm">
                Already have an account ?{" "}
                <Link to ="/login" className="text-[#2aabee] hover:underline">
                Login</Link>
            </p>
        </div>
      </div>
    )
}

export default Register