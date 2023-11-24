//main
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const logger = require("morgan");
//extra
const HttpException = require("./utils/HttpException.utils");
const errorMiddleware = require("./middleware/error. middleware");
const userRouter = require("./routes/user.route");
const userProgressRouter = require("./routes/userProgress.route");
const questionRouter = require("./routes/question.route");

const app = express();

dotenv.config();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));

const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

const port = Number(process.env.PORT || 3331);

app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/user-progress`, userProgressRouter);
app.use(`/api/v1/questions`, questionRouter);

app.all("*", (req, res, next) => {
  const err = new HttpException(404, "Endpoint Not Found");
  next(err);
});

app.use(errorMiddleware);

app.listen(port, () => console.log(`🚀 Server running on port ${port}!`));
