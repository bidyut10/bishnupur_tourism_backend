const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const route = require("./routes/routes");

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", route);

mongoose
  .connect(
    "mongodb+srv://bidyut10:kabir34268@cluster0.rw6eu.mongodb.net/Bishnupur_Tourism?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 3001, function () {
  console.log(
    "Express app running on port http://localhost:" + (process.env.PORT || 3001)
  );
});
