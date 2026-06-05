const Message = require("../models/Message")

exports.sendMessage = async(req,res)=>{
    try{
        const {receiver, message} = req.body

        const newMessage = new Message({
            sender : req.user.id,
            receiver,
            message,
        })

        await newMessage.save()

        res.status(201).json(newMessage)
    }catch(err){
        res.status(500).json({message:"server error"})
    }
}

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    })
    .populate("sender", "_id username")
    .populate("receiver", "_id username")
    .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};