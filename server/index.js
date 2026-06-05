const path = require("path")
const express = require("express")
const http = require("http")
const socketio = require("socket.io")
const cors = require("cors")
require("dotenv").config()

const mongoose =require("mongoose")

mongoose.connect(process.env.MONGO_URI)
  .then(()=> console.log("MongoDB connected"))
  .catch((err)=>console.log("mongodb error:", err))

const app = express()
const server = http.createServer(app)
const io = socketio(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"],
    },
})

app.use(cors())
app.use(express.json())

const authRoutes = require("./routes/auth")

app.use("/api/auth", authRoutes)

const messageRoutes = require("./routes/message")

app.use("/api/messages", messageRoutes)

const userRoutes = require("./routes/user")

app.use("/api/users",userRoutes)

const onlineUsers = new Map()

io.on("connection",(socket)=>{
    console.log(" a user connected", socket.id)

    socket.on("addUser", (userId)=>{
        onlineUsers.set(userId, socket.id)
        io.emit("getOnlineUsers", Array.from(onlineUsers.keys()))
    })

    socket.on("sendMessage", ({sender, receiver, message})=>{
        const receiverSocketId = onlineUsers.get(receiver)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("receiveMessage", {sender, message})
        }
    })

    socket.on("disconnect",()=>{
        onlineUsers.forEach((value,key)=>{
            if(value === socket.id) onlineUsers.delete(key)
        })
        io.emit("getOnlineUsers", Array.from(onlineUsers.keys()))
        console.log("user disconnected", socket.id)
    })
})

app.use(express.static(path.join(__dirname, "../client/build")))

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"))
})


const PORT = process.env.PORT||5000
server.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})