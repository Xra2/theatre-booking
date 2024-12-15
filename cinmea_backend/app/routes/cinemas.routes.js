const { authJwt } = require("../middleware");
const controller = require("../controllers/cinema.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.get(
    "/api/cinema/",
    [authJwt.verifyToken],
    controller.getCinemas
  );

  app.post(
    "/api/cinema/:id",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.handleUpdate
  );

  app.put(
    "/api/cinema/",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.handleCreate
  );

  app.delete(
    "/api/cinema/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.handleDelete
  )
};