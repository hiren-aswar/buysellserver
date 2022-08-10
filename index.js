var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");

const http = require("http");

require("jsdom-global/register");
const { Server } = require("socket.io");
require("dotenv").config();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb+srv://chat:hviirr72@chat.uswrm.mongodb.net/db?retryWrites=true&w=majority");
var company = require("./Schema.js");
var msg = require("./Schematwo.js");
const { find } = require("./Schematwo.js");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.get("/read", async (req, res) => {
  const data = await company.find();
  res.send(data);
});
app.post("/register", async (req, res) => {
  console.log(req.body);
  const data = new company({
    name: req.body.name,
    password: req.body.password,
    role: "user",
    room: req.body.password,
  });
  try {
    const result = await data.save();
    console.log(result);
    res.send({ user: true, data: result });
  } catch (e) {
    res.send({ user: false });
  }
});
app.post("/login", async (req, res) => {
  const data = await company.find({
    password: req.body.password,
    name: req.body.name,
  });
  if (data.length === 0) {
    res.send({ user: "login" });
  } else if (data[0].role === "admin") {
    res.send({ user: "admin", data: data });
  } else {
    res.send({ user: "user", data: data });
  }
});

io.on("connection", async (socket) => {
  socket.on("join-room", async (data) => {
    if (data.role === "user") {
      socket.emit("room-info", { room: data.room, auther: data.name });
    }
  });

  socket.on("need-data", async () => {
    const data = await msg.find();

    socket.emit("take-data", data);
  });
  socket.on("room", (data) => {
    socket.emit("need", data);
  });
  socket.on("price", async (data) => {
    console.log(data);
    const message = new msg({
      room: data.room,
      auther: data.auther,
      product: data.product,
      price: data.price,
    });
    const res = await message.save();
    console.log(res);
  });
  socket.on("c-need",async ()=>{
    const com= await company.find();
    socket.emit("c-take",com)
  })
  socket.on("passroom", async(data)=>{
     
     const chats= await msg.find()
     socket.emit("t-chats",chats)
     socket.emit("info",data)
     
  })
  socket.on("adminmsg",async(data)=>{
     console.log(data)
     const adminmsg= new msg({
      room:data.roo,
      product:data.product,
      q:data.q,
      auther:data.auther
     })
     const r=await adminmsg.save()
  })
  socket.on("needdata",async ()=>{
    const hiren=await msg.find();
    socket.emit("kevin",hiren)
  })
  
});
const PORT = process.env.PORT;
server.listen(process.env.PORT || 3001, () => {
  console.log("hello");
});
