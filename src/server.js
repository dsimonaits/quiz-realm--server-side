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

//Init express
const app = express();

//Init environment
dotenv.config();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));

// parse requests of content-type: application/json
// parses incoming requests with JSON payloads
app.use(express.json());

// enabling cors for all requests by using cors middleware
// app.use(cors());
// Enable pre-flight
const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

const port = Number(process.env.PORT || 3331);

app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/user-progress`, userProgressRouter);
app.use(`/api/v1/questions`, questionRouter);

// 404 error
app.all("*", (req, res, next) => {
  const err = new HttpException(404, "Endpoint Not Found");
  next(err);
});

// Error middleware
app.use(errorMiddleware);

// starting the server
app.listen(port, () => console.log(`🚀 Server running on port ${port}!`));
