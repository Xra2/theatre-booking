module.exports = (sequelize, DataTypes) => {
  const Cinema = sequelize.define("Cinema", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    }
  });
  return Cinema;
};
