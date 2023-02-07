const express = require("express");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const logger = require("morgan");
const cors = require("cors");

require("dotenv").config();

const servicesRouter = require("./routes/api/services");
const newsRouter = require("./routes/api/news");
const { authRouter } = require("./routes/api/auth");
const userRouter = require("./routes/api/user");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/news", newsRouter);
app.use("/api/user", userRouter);
app.use('/api/users', authRouter);
app.use("/api/services", servicesRouter);


app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
