// types
import {Express} from "express";

function htmlRoutes(app: Express) {
  app.get("/", (request, response) => {
    response.render("sharing");
  })

  app.get("/:path", (request, response) => {
    response.render("getting", {
      senderId: request.params.path
    });
  })
}

module.exports = htmlRoutes;