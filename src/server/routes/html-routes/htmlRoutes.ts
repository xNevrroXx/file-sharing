// types
import {Express} from "express";
// third-party modules
const path  = require("path");
const fs  = require("fs");
// own modules
const conversionSizeUnits = require("../../modules/conversion-size-units.js");

function htmlRoutes(app: Express, USERS_FOLDER: string) {
  app.get("/", (request, response) => {
    response.render("sharing", {
      title: "file sharing"
    });
  })

  app.get("/:path", (request, response) => {
    const folder = request.params.path;
    const targetFolder = path.join(USERS_FOLDER, "unzipped", folder);

    try {
      const checkFolderResult = fs.statSync(targetFolder);

      try {
        const fileNames: string[] = fs.readdirSync(targetFolder);
        const filesInfo = [];
        let totalSizeFiles = 0;
        let sizeAndUnits: {amount: string, units: string};
        if (fileNames.length === 0) {
          throw new Error("There are no files");
        }

        for (const fileName of fileNames) {
          const fileInfo = fs.statSync(path.join(targetFolder, fileName));
          filesInfo.push({
            name: fileName,
            size: conversionSizeUnits(fileInfo.size)
          })
          totalSizeFiles += fileInfo.size;
        }

        sizeAndUnits = conversionSizeUnits(totalSizeFiles);
        response.render("getting", {
          title: "file sharing - getting",
          files: filesInfo,
          totalSize: sizeAndUnits
        });
      }
      catch (error) {
        response.status(404);
        response.render("error", {
          title: "file sharing - 404 error",
          layout: "error"
        });
      }
    }
    catch (error) {
      response.status(404);
      response.render("error", {
        title: "file sharing - 404 error",
        layout: "error"
      });
    }
  })
}

module.exports = htmlRoutes;