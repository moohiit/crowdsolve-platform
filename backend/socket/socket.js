const socketSetup = (io)=>{
  io.on("connection", (socket)=>{
  console.log("New client connected", socket.id);
  socket.on("joinRoom", (roomId)=>{
    socket.join(roomId);
    console.log(`Client ${socket.id} joined room ${roomId}`);
  });
  socket.on("sendNotification", (data)=>{
    const { userId, message, link } = data;
    // Emit notification to specific user room
    console.log(`Sending notification to user ${userId}`);
    socket.to(userId).emit("receiveNotification", { message, link, date: new Date()});
  });
  socket.on("disconnect", ()=>{
    console.log("Client disconnected", socket.id);
  })
})
}

export default socketSetup;

