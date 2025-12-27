const express = require("express");
const app = express();
require("dotenv").config();
const cookie = require("cookie-parser");
// const session = require("express-session");
const connectToMongo = require("./connection");
const autRouter = require("./router/auth");
const productRouter = require("./router/product");
const cors = require("cors");

const { validateAuthToken } = require("./middleware/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true,
// }))
// // const allowedOrigins = [
// //   "http://localhost:3000",
// //   "https://fe-project-mgt.vercel.app"
// // ];
const allowedOrigins = [
  "http://localhost:3000",
  "https://client-gamma-black.vercel.app"
];


app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// app.use(session({
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false }  //set true only in production with HTTPS

// }))

app.use(cookie())


connectToMongo(process.env.MONGO_URL);

// public api's
app.use("/auth", autRouter);
app.get("/cron", (req, res) => {
  return res.json({ msg: "get call success!", status_code: 200 });
});
// protected api's
app.use("/", validateAuthToken("token"), productRouter);

app.listen(process.env.PORT, () =>
  console.log(`App started at port ${process.env.PORT}`)
);
