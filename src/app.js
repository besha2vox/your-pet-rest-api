const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
require("dotenv").config();

const usersRouter = require("./routes/api/users");
const noticesRouter = require("./routes/api/notices");
const petsRouter = require("./routes/api/pets");
const newsRouter = require("./routes/api/news");
const friendsRouter = require("./routes/api/friends");
const catsRouter = require("./routes/api/cats");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/users", usersRouter);
app.use("/api/notices", noticesRouter);
app.use("/api/pets", petsRouter);
app.use("/api/news", newsRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/cats", catsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  console.log({ err });
  res.status(status).json(message);
});

module.exports = app;
