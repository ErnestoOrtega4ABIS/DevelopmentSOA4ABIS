import {DataTypes} from "sequelize";
import sequelize from "../config/db.js";
import Category from "./categoryModel.js";

const Product = sequelize.define('Product', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    ProductName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    
    UnitPrice:{
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    DateImplementation:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },

    Stock:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    CategoryID:{
        type: DataTypes.STRING,
        allowNull: false,
        references:{
            model: Category,
            key: 'id',
        }
    },

    Status:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
},{
    timestamps: false,
    tableName: 'products'
});

Category.hasMany(Product, {foreignKey: 'CategoryID', as : 'products'});
Product.belongsTo(Category, {foreignKey: 'CategoryID', as: 'category'});

export default Product;