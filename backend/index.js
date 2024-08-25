import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import sequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import AttendanceRoute from "./routes/AttendanceRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import path from "path"; 
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

const sessionStore = sequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

// (async () => {
//   await db.sync();
// })();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000", 
  })
);
app.use(express.json());

const uploadDir = path.join(__dirname, "../frontend/public/uploads");
app.use("/uploads", express.static(uploadDir));

app.use(UserRoute);
app.use(AttendanceRoute);
app.use(AuthRoute);

app.listen(process.env.APP_PORT, () => {
  console.log(
    `Server up and running on http://localhost:${process.env.APP_PORT}`
  );
});
