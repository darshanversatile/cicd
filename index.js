const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const app = express();

app.use(express.json()); // For JSON payloads
app.use(express.urlencoded({ extended: true })); // For URL-encoded payloads

const filePath = path.join(__dirname, "request-body.txt");

app.post("/", (req, res) => {
  const { payload } = req.body;

  // Parse the payload from a JSON string to an object
  let parsedPayload;
  try {
    parsedPayload = JSON.parse(payload);
  } catch (err) {
    console.error("Error parsing payload:", err);
    return res.status(400).send("Bad Request: Invalid payload format");
  }

  // Log the parsed payload for debugging
  fs.writeFile(filePath, JSON.stringify(parsedPayload, null, 2), (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return res.status(500).send("Internal Server Error");
    }
  });

  // Check if this is a pull request closed event with a merge
  if (
    parsedPayload.action === "closed" &&
    parsedPayload.pull_request &&
    parsedPayload.pull_request.merged_at
  ) {
    // Check if the PR merged 'main' into 'prod'
    const headBranch = parsedPayload.pull_request.head.ref;
    const baseBranch = parsedPayload.pull_request.base.ref;

    if (headBranch === "main" && baseBranch === "prod") {
      // Handle the event when 'main' is merged into 'prod'
      console.log("The main branch was merged into the prod branch.");

      // Define the directory where you want to run 'npm install'
      const projectDir = `C:\\Users\\VERSATILE\\Desktop\\FlutterNodeMSSql_TemplateGit\\NodeMSSqlTemplate`;

      // Run 'npm install' in the specified directory
      exec(`cd ${projectDir} && npm install`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error running npm install: ${error.message}`);
          return res
            .status(500)
            .send("Internal Server Error during npm install");
        }
        if (stderr) {
          console.error(`npm install stderr: ${stderr}`);
        }
        console.log(`npm install stdout: ${stdout}`);
        res.send(
          "Main branch merged into Prod branch and npm install completed."
        );
      });

      return; // Ensure no further response is sent
    }
  }

  res.status(200).send("Event received");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
