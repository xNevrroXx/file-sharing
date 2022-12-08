// types
import {Express, Request} from "express";
// third-party modules
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const {v4: uuidv4} = require("uuid");
const AdmZip = require("adm-zip");
// owm modules
const htmlRoutes = require("./html-routes/htmlRoutes");

const USERS_FOLDER = path.join(__dirname, "..", "users-data");
const storage = multer.diskStorage({
  destination: function(request: Request, file: any, cb: (smth: null, path: string) => void) {
    const folderPath = path.join(USERS_FOLDER, "unzipped", file.fieldname);
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
    const folder = request.params.path;
    const targetFolder = path.join(USERS_FOLDER, "unzipped", folder);

    try {
      const checkFolderResult = fs.statSync(targetFolder);

      try {
        const fileNames: string[] = fs.readdirSync(targetFolder);
        if (fileNames.length === 0) {
          throw new Error("There are no files");
        }

        response.json({
          message: "There are files",
          files: fileNames
        })
      }
      catch (error) {
        response.json({
          message: "There aren't files"
        })
      }
    }
    catch (error) {
      response.status(404).json({
        message: "There is no such user"
      })
    }

  })

  htmlRoutes(app);
}

module.exports = routes;