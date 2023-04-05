// types
import {Express, Request, Response} from "express";
// third-party modules
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const AdmZip = require("adm-zip");
// owm modules
const htmlRoutes = require("./html-routes/htmlRoutes.js");

const USERS_FOLDER = path.join(__dirname, "..", "users-data");

// @ts-ignore
const storage = multer.diskStorage({
// @ts-ignore
  destination: function(request: Request, file: File, cb: (error: Error | null, destination: string) => void) {
// @ts-ignore
    const folderPath = path.join(USERS_FOLDER, "unzipped", file.fieldname);
    if (!fs.existsSync(path.join(USERS_FOLDER, "unzipped"))) {
      fs.mkdirSync(path.join(USERS_FOLDER, "unzipped"), { recursive: true });
    }
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    cb(null, folderPath);
  },
  filename: function(request: Request, file: any, cb: (smth: null, filename: string) => void) {
    cb(null, file.originalname);
  }
})
const upload = multer({
  storage: storage,
});

function routes(app: Express) {
  app.post("/upload", upload.any(), (request, response) => {
    const files = request.files;
    // @ts-ignore
    const folderName = files[0].fieldname;

    response.json({
      message: "files has been uploaded",
      path: folderName
    })

    const zip = new AdmZip();
    zip.addLocalFolder(path.join(USERS_FOLDER, "unzipped", folderName));
    zip.writeZip(path.join(USERS_FOLDER, "zipped", folderName + ".zip"))
  })

  app.get("/download/:path", (request, response) => {
    const zippedFiles = request.params.path + ".zip";
    const targetFolder = path.join(USERS_FOLDER, "zipped", zippedFiles);

    try {
      const checkIfExist = fs.statSync(targetFolder);

      response.download(targetFolder);
    }
    catch (error) {
      response.status(404).json({
        message: "There are no files"
      })
    }
  }) 
  app.get("/download/:folderName/:fileName", (request: Request<{ folderName: string, fileName: string}>, response: Response) => {
    const folderName = request.params.folderName;
    const fileName = request.params.fileName;
    const targetFile = path.join(USERS_FOLDER, "unzipped", folderName, fileName);

    try {
      const checkIfExist = fs.statSync(targetFile);

      // @ts-ignore
      response.download(targetFile, {dotfiles: "allow"});
    }
    catch (error) {
      response.status(404).json({
        message: "There is no such file"
      })
    }
  })

  htmlRoutes(app, USERS_FOLDER);
}

module.exports = routes;