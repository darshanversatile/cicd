const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.post("/", (req, res) => {
  const filePath = path.join(__dirname, "request-body.txt");

  const requestBody = JSON.stringify(req.body, null, 2);

  fs.writeFile(filePath, requestBody, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.send("Request body written to file successfully");
  });
});

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "request-body.txt");

  const requestBody = JSON.stringify(req.body, null, 2);

  fs.writeFile(filePath, requestBody, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.send("Request body written to file successfully");
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
