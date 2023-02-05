const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 3030;
const DB = process.env.DB_HOST;

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);
const connection = mongoose.connect(DB);

connection
  .then(() =>
    app.listen(PORT, () => {
      console.log("Server running. Use our API on port:", PORT);
      console.log("Database connection successful");
    })
  )
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });