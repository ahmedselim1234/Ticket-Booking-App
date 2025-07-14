require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/dbnonnect");
const corsOptions = require("./config/corsOptions");
const app = express();
const port = process.env.PORT || 3000;
//-------------

//require routes
// const ticketsRoutes = require("./routes/tickets");
const adminRoutes = require("./routes/admin");
const clientRoutes = require("./routes/client");
const authRoutes = require("./routes/authRoutes");

//middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
// app.use("/api/tickets", ticketsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/", clientRoutes);
app.use("/auth", authRoutes);

//----------
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log("cannot connect to db", err);
  });
