"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
app.use((0, express_fileupload_1.default)({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.post("/delete", function (req, res) {
    if (!req.body.path) {
        return res.status(400).send("No files were uploaded.");
    }
    const path = req.body.path;
    fs_1.default.unlink(path, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).send("File deleted");
    });
});
app.post("/upload", function (req, res) {
    var _a, _b;
    if (!((_a = req.files) === null || _a === void 0 ? void 0 : _a.file)) {
        res.status(400).end("No files were uploaded.");
        return;
    }
    if (!req.body.directory) {
        res.status(400).end("No directory was specified.");
        return;
    }
    const directory = ("/var/www/cdn" + req.body.directory);
    try {
        if (!fs_1.default.lstatSync(directory).isDirectory()) {
            const f = fs_1.default.mkdirSync(directory, { recursive: true });
            if (!f) {
                res.status(500).end("Could not create directory.");
                return;
            }
        }
    }
    catch (error) {
        const f = fs_1.default.mkdirSync(directory, { recursive: true });
    }
    console.log(`Directory ${directory} created`);
    if (!directory.startsWith("/")) {
        res.status(400).end("Directory must start with /");
    }
    const file = req.files.file;
    const filePath = (_b = directory + req.body.filename) !== null && _b !== void 0 ? _b : file === null || file === void 0 ? void 0 : file.name;
    try {
        if (fs_1.default.lstatSync(filePath).isDirectory() ||
            fs_1.default.lstatSync(filePath).isFile()) {
            fs_1.default.rmSync(filePath, { recursive: true, force: true });
        }
    }
    catch (error) { }
    file.mv(filePath, function (err) {
        if (err) {
            console.log(`Error moving file: ${err}`);
            res.status(500).send(err);
        }
        console.log("File uploaded to " + filePath);
        res.status(200).end("File uploaded!");
    });
});
app.listen(4000, () => {
    console.log("Server started at http://localhost:4000");
});
