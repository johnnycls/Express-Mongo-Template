import express from "express";
import cors from "cors";
import InitiateMongoServer from "./db.js";
import { PORT } from "./config.js";
import userRouter from "./routes/user.js";

InitiateMongoServer();

const app = express();
const port = PORT || 5000;

app.use(cors({ origin: [] }));
app.use(express.json());

app.use("/user", userRouter);
app.use("*", (req, res, next) => {
  const error = {
    status: 404,
    message: "Api endpoint does not found",
  };
  next(error);
});

app.listen(port, () => {
  console.log(`${port}`);
});
