// types
import {Express, response} from "express";
// third-party modules
const path = require("path");
const fs = require("fs");
const multer = require("multer");
// owm modules
const htmlRoutes = require("./html-routes/htmlRoutes");

const USERS_FOLDER = path.join(__dirname, "..", "users-data");
const upload = multer({
  dest: USERS_FOLDER,
});

function routes(app: Express) {
  app.post("/upload/:id", upload.any(), (request, response) => {
    response.json({
      message: "files has been uploaded"
    })
  })

  app.get("/upload/:id", (request, response) => {
    const id = request.params.id;
    const targetFolder = USERS_FOLDER + path.sep + id;

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