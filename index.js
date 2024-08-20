const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json()); // For JSON payloads
app.use(express.urlencoded({ extended: true })); // For URL-encoded payloads

const filePath = path.join(__dirname, "request-body.txt");

app.post("/", (req, res) => {
  const payload = req.body;
  console.log(payload);
  // Log payload for debugging
  fs.writeFile(filePath, JSON.stringify(payload, null, 2), (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return res.status(500).send("Internal Server Error");
    }
  });

  // Check for the specific merge event
  if (payload.ref === "refs/heads/prod" && payload.before && payload.after) {
    // Look for a specific push event where 'main' was merged into 'prod'
    const isMerge = payload.commits.some((commit) =>
      commit.message.includes("Merge branch 'main'")
    );

    if (isMerge) {
      // Send notification or handle the merge event
      console.log("The main branch was merged into the prod branch.");
      return res.send("Main branch merged into Prod branch.");
    }
  }

  res.status(200).send("Event received");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
