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
        return res.status(400).send("No files were selected.");
    }

    const path = req.body.path;

    fs.unlink(path, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).send("File deleted");
    }
    

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

  const directory = req.body.directory as string;
  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

  if (!directory.startsWith("/"))
    res.status(400).end("Directory must start with /");

  const file = req.files.file as fileUpload.UploadedFile;

  file.mv("/var/www/cdn" + directory + "/" + file.name, function (err: any) {
    if (err) return res.status(500).send(err);

    res.send("File uploaded!");
  });
});

app.listen(4000, () => {
  console.log("Server started at http://localhost:4000");
});
