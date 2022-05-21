import express from "express";
import fileUpload from "express-fileupload";
import fs from "fs";
const app = express();

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.post("/delete", function (req, res) {
  if (!req.body.path) {
    return res.status(400).send("No files were uploaded.");
  }

  const path = req.body.path;

  fs.unlink(path, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("File deleted");
  });
});

app.post("/upload", function (req, res) {
  if (!req.files?.file) {
    res.status(400).end("No files were uploaded.");
    return;
  }

  if (!req.body.directory) {
    res.status(400).end("No directory was specified.");
    return;
  }

  const directory = ("/var/www/cdn" + req.body.directory) as string;

  try {
    if (!fs.lstatSync("/var/www/cdn/damar/test/notexists").isDirectory()) {
      const f = fs.mkdirSync(directory, { recursive: true });
      if (!f) {
        res.status(500).end("Could not create directory.");
        return;
      }
    }
  } catch (error) {
    const f = fs.mkdirSync(directory, { recursive: true });
  }

  console.log(`Directory ${directory} created`);

  if (!directory.startsWith("/")) {
    res.status(400).end("Directory must start with /");
    return;
  }

  const file = req.files.file as fileUpload.UploadedFile;

  file.mv(directory + "/" + file.name, function (err: any) {
    if (err) {
      console.log(`Error moving file: ${err}`);

      return res.status(500).send(err);
    }
    console.log("File uploaded to " + directory + "/" + file.name);
    res.send("File uploaded!");
  });
});

app.listen(4000, () => {
  console.log("Server started at http://localhost:4000");
});
