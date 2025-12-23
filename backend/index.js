import express from "express";
import { PORT, mongodbconn } from "./config.js";
import userRoute from "./User/routes/userRoute.js";
import authRoute from "./User/routes/authRoute.js";
import productRoute from "./User/routes/productRoute.js";
import categoryRoute from "./User/routes/categoryRoute.js";
import feedbackRoute from "./User/routes/feedbackRoute.js";
import notificationRoute from "./User/routes/notificationRoute.js";
import regulationRoute from "./User/routes/regulationRoute.js";
import reviewRoute from "./User/routes/reviewRoute.js";
import paymentRoute from "./User/routes/paymentRoute.js";
import orderRoute from "./User/routes/orderRoute.js";
import orderDetailRoute from "./User/routes/orderDetailRoutes.js";
import cartRoute from "./User/routes/cartRoute.js";
import mongoose from "mongoose";
import cors from "cors";
import adminRouter from "./Admin/routes/Adminroute.js";
import paymentRoutes from "./User/routes/payment.js";
import mailRoute from "./User/routes/mailRoute.js";
import messageRouter from "./User/routes/messageRoutes.js";
import conversationRouter from "./User/routes/conversationRoutes.js";
import VNPayAccountRouter from "./User/routes/vnPayAccountRoutes.js";
import countriesRouter from "./User/routes/countryRoutes.js";
import categoryDetailsRouter from "./User/routes/categoryDetailsRoutes.js";
import vnPayCheckout from "./User/routes/vnPayCheckout.js";

import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
  },
});

// CORS Options
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://10.0.2.2:5555",
  ],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

// Định nghĩa các route
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/products", productRoute);
app.use("/categories", categoryRoute);
app.use("/feedbacks", feedbackRoute);
app.use("/notifications", notificationRoute);
app.use("/regulations", regulationRoute);
app.use("/reviews", reviewRoute);
app.use("/payments", paymentRoute);
app.use("/orders", orderRoute);
app.use("/orderDetails", orderDetailRoute);
app.use("/carts", cartRoute);
app.use("/payment", paymentRoutes);
app.use("/mail", mailRoute);
app.use("/conversations", conversationRouter);
app.use("/messages", messageRouter);
app.use("/api/vnpay", VNPayAccountRouter);
app.use("/countries", countriesRouter);
app.use("/categoryDetails", categoryDetailsRouter);
app.use("/vnPayCheckout", vnPayCheckout);

// Admin
app.use("/admin", adminRouter);

// Socket.IO
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on("sendNotification", () => {
    socket.broadcast.emit("receiveNotification");
  });

  socket.on("sendMessage", () => {
    socket.emit("newMessage");
    socket.broadcast.emit("newMessage");
  });

  socket.on("addCart", () => {
    socket.broadcast.emit("addToCart");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Kết nối tới MongoDB
mongoose
  .connect(mongodbconn)
  .then((conn) => {
    console.log("App connected to database");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    server.listen(PORT, "0.0.0.0", () => {
      // Lắng nghe từ tất cả các địa chỉ IP
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// import express from "express";
// import { PORT, mongodbconn } from "./config.js";
// import userRoute from "./User/routes/userRoute.js";
// import authRoute from "./User/routes/authRoute.js";
// import productRoute from "./User/routes/productRoute.js";
// import categoryRoute from "./User/routes/categoryRoute.js";
// import feedbackRoute from "./User/routes/feedbackRoute.js";
// import notificationRoute from "./User/routes/notificationRoute.js";
// import regulationRoute from "./User/routes/regulationRoute.js";
// import reviewRoute from "./User/routes/reviewRoute.js";
// import paymentRoute from "./User/routes/paymentRoute.js";
// import orderRoute from "./User/routes/orderRoute.js";
// import orderDetailRoute from "./User/routes/orderDetailRoutes.js";
// import cartRoute from "./User/routes/cartRoute.js";
// import mongoose from "mongoose";
// import cors from "cors";
// import adminRouter from "./Admin/routes/Adminroute.js";
// import paymentRoutes from "./User/routes/payment.js";
// import mailRoute from "./User/routes/mailRoute.js";
// import messageRouter from './User/routes/messageRoutes.js';
// import conversationRouter from "./User/routes/conversationRoutes.js";

// import http from "http";
// import { Server } from "socket.io";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173"],
//     methods: ["GET", "POST"],
//   },
// });

// const corsOptions = {
//   // origin: "*",
//   origin: ["http://localhost:5173", "http://localhost:5174"],
//   optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

// app.use(express.json());

// app.use("/auth", authRoute);
// app.use("/users", userRoute);
// app.use("/products", productRoute);
// app.use("/categories", categoryRoute);
// app.use("/feedbacks", feedbackRoute);
// app.use("/notifications", notificationRoute);
// app.use("/regulations", regulationRoute);
// app.use("/reviews", reviewRoute);
// app.use("/payments", paymentRoute);
// app.use("/orders", orderRoute);
// app.use("/orderDetails", orderDetailRoute);
// app.use("/carts", cartRoute);
// app.use("/payment", paymentRoutes);
// app.use("/mail", mailRoute);
// app.use("/conversations", conversationRouter)
// app.use("/messages", messageRouter);

// // Admin
// app.use("/admin", adminRouter);

// // Socket.IO
// io.on("connection", (socket) => {
//   console.log(`A user connected: ${socket.id}`);

//   socket.on("sendNotification", () => {
//     socket.broadcast.emit("receiveNotification");
//   });

//   socket.on("sendMessage", () => {
//     socket.emit("newMessage");
//     socket.broadcast.emit("newMessage");
//   });

//   socket.on("addCart", ()=>{
//     socket.broadcast.emit("addToCart");
//   })

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

// mongoose
//   .connect(mongodbconn)
//   .then((conn) => {
//     console.log("App connected to database");
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//     server.listen(PORT, () => {
//       console.log(`Server is running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Database connection error:", error);
//   });
