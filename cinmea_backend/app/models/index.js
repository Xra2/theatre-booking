const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
});

(db.cinema = require("./cinema.model.js")(sequelize, Sequelize)),
  (db.purchases = require("./purchase.model.js")(sequelize, Sequelize)),
  db.cinema.hasMany(db.purchases, { foreignKey: "purchaseId", as: "purchases" });
db.purchases.belongsTo(db.cinema, { foreignKey: "cinemaId", as: "cinema" });


// Users (customers) have many purchases
db.user.hasMany(db.purchases, { foreignKey: "userId", as: "purchases" });
db.purchases.belongsTo(db.user, { foreignKey: "userId", as: "user" });

// db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
