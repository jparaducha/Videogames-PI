const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('videogame', {
    uuid : {
      type: DataTypes.UUID,
      defaultValue : DataTypes.UUIDV1,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_background : {
      type: DataTypes.STRING
    },
    released : {
      type: DataTypes.STRING,
    },
    rating : {
      type: DataTypes.INTEGER
    },
    platforms : {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    score : {
      type: DataTypes.STRING
    },
    metacritic : {
      type : DataTypes.INTEGER
    }
  }, {timestamps: false});
};
