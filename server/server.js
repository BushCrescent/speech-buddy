require("dotenv").config();
const express = require("express");
const api = require("./routes/api");
const cors = require("cors");
const path = require("path");
// const multer = require("multer");
// const upload = multer({ dest: "img/" });

//create server and port
const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: "*",
  })
);

//set up body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(upload.array());

//public asset access
app.use(express.static("public"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/"));
});

app.use(api);

//turn on the server and
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
