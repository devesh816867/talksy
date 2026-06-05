import React, {useEffect, useState} from "react"
import axios from "../utils/axios"
import {useAuth} from "../context/AuthContext"

function Sidebar({setSelectedUser}){
    const [users, setUsers] = useState([])
    const[selected, setSelected] = useState(null)
    const {user, token, logout} = useAuth()

    useEffect(()=>{
        const fetchUsers = async()=>{
            try{
                const res = await axios.get("/users",{
                    headers:{Authorization:`Bearer ${token}`}
                })
                setUsers(res.data.filter((u)=>u._id!== user.id))
            }catch(err){
                console.log(err)
            }
        }
        fetchUsers()
    },[token, user])

    const handleSelect = (u)=>{
        setSelected(u._id)
        setSelectedUser(u)
    }

    return(
        <div className="w-80 bg-[#17212b] flex flex-col h-screen border-r border-[#242f3d]">
            <div className="flex items-center justify-between px-4 border px-4 py-4 border-b border-[#242f3d]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2aabee] flex items-center justify-center text-white font-bold text-lg">
                        {user.username[0].toUpperCase()}
                    </div>
                    <span className="text-white font-semibold">{user.username}</span>
                </div>
                <button onClick={logout} className="text-gray-400 hover:text-red-400 text-sm transition">Logout</button>
            </div>
              
            {/*search */}
            <div className="px-4 py-3 border-b border-[#242f3d]">
                <input
                  type="text"
                  placeholder="search..."
                  className="w-full bg-[#242f3d] text-white placeholder-gray-500 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[32aabee] text-sm"
                />
            </div>

            {/*users list */}
            <div className="flex-1 overflow-y-auto">
                {users.length === 0 ? (
                    <p className="text-gray-500 text-center mt-10 text-sm">No users found</p>
                ):(
                    users.map((u)=>(
                        <div 
                          key={u._id}
                          onClick={()=>handleSelect(u)}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#242f3d] transition ${
                            selected === u._id ? "bg-[#242f3d]" :""
                          }`}
                        >
                            <div className="w-10 h-10 rounded-full bg-[#2aabee] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                {u.username[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="text-white font-medium">{u.username}</p>
                                <p className="text-gray-500 text-xs">Click to chat</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Sidebar