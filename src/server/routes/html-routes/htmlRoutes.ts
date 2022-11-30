// types
import {Express} from "express";

function htmlRoutes(app: Express) {
  app.get("/", (request, response) => {
    response.render("sharing");
  })

  app.get("/download/:id", (request, response) => {
    response.render("getting", {
      senderId: request.params.id
    });
  })
}

module.exports = htmlRoutes;