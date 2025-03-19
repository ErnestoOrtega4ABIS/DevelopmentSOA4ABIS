import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import doten from "dotenv";

doten.config();

export const getProducts = async (req, res) => {
    try {
        // Filtrar productos que no estén dados de baja (Status = true)
        const products = await Product.findAll({
            where: {
                Status: true, 
            },
            include: {
                model: Category,
                as: 'category',
                attributes: ['Name']
            }
        });

        return res.status(200).json({ products });
    } catch (error) {
        console.error('Error al obtener productos: ', error);
        return res.status(500).json({ message: 'Error al obtener productos' });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { ProductName, UnitPrice, Stock, CategoryID } = req.body;

        // Validar campos obligatorios
        if (!ProductName || !UnitPrice || !Stock || !CategoryID) {
            return res.status(400).json({ message: 'Nombre del producto, precio, stock y categoría son obligatorios' });
        }

        // Validar si el producto ya existe
        const existingProduct = await Product.findOne({ where: { ProductName } });
        if (existingProduct) {
            return res.status(400).json({ message: 'El producto ya existe' });
        }

        // Validar que el precio sea un número positivo
        if (typeof UnitPrice !== 'number' || UnitPrice <= 0) {
            return res.status(400).json({ message: 'El precio debe ser un número positivo' });
        }

        //Validar que el precio sea un numero y no caracter
        if (isNaN(UnitPrice)) {
            return res.status(400).json({ message: 'El precio debe ser un número' });
        }

        // Validar que el stock sea un número entero y positivo
        if (!Number.isInteger(Stock) || Stock <= 0) {
            return res.status(400).json({ message: 'El stock debe ser un número entero positivo' });
        }

        // Validar si la categoría existe
        const existingCategory = await Category.findOne({ where: { id: CategoryID } });
        if (!existingCategory) {
            return res.status(400).json({ message: 'La categoría no existe' });
        }


        // Crear nuevo producto
        const newProduct = await Product.create({
            ProductName,
            UnitPrice,
            Stock,
            CategoryID,
            Status: true,
            DateImplementation: new Date()
        });

        return res.status(201).json({ message: "Producto creado con éxito", product: newProduct });
    } catch (error) {
        console.error('Error al crear producto: ', error);
        return res.status(500).json({ message: 'Error al crear producto' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // ID del producto a modificar
        const { ProductName, UnitPrice, Stock, CategoryID } = req.body;

        // Validar que el producto exista
        const existingProduct = await Product.findOne({ where: { id } });
        if (!existingProduct) {
            return res.status(404).json({ message: 'El producto no existe' });
        }

        // Validar que el nombre del producto no esté duplicado (si se proporciona)
        if (ProductName) {
            const duplicateProduct = await Product.findOne({ where: { ProductName } });
            if (duplicateProduct && duplicateProduct.id !== parseInt(id)) {
                return res.status(400).json({ message: 'El nombre del producto ya está en uso' });
            }
        }

        // Validar que el precio sea un número positivo (si se proporciona)
        if (UnitPrice && (typeof UnitPrice !== 'number' || UnitPrice <= 0)) {
            return res.status(400).json({ message: 'El precio debe ser un número positivo' });
        }

        // Validar que el stock sea un número entero y positivo (si se proporciona)
        if (Stock && (!Number.isInteger(Stock) || Stock <= 0)) {
            return res.status(400).json({ message: 'El stock debe ser un número entero positivo' });
        }

        // Validar que la categoría exista (si se proporciona)
        if (CategoryID) {
            const existingCategory = await Category.findOne({ where: { id: CategoryID } });
            if (!existingCategory) {
                return res.status(400).json({ message: 'La categoría no existe' });
            }
        }

        const updatedProduct = await Product.update(
            {
                ProductName: ProductName || existingProduct.ProductName,
                UnitPrice: UnitPrice || existingProduct.UnitPrice,
                Stock: Stock || existingProduct.Stock,
                CategoryID: CategoryID || existingProduct.CategoryID,
            },
            {
                where: { id },
                returning: true, 
            }
        );

        // Obtener el producto actualizado
        const product = await Product.findOne({ where: { id } });

        return res.status(200).json({ message: 'Producto actualizado con éxito', product });
    } catch (error) {
        console.error('Error al actualizar producto: ', error);
        return res.status(500).json({ message: 'Error al actualizar producto' });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si el producto existe
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Verificar si el producto ya está desactivado
        if (!product.Status) {
            return res.status(400).json({ message: "El producto ya está desactivado." });
        }

        // Cambiar el estado del producto a false (dar de baja)
        await product.update({ Status: false });

        return res.status(200).json({ message: 'Producto dado de baja correctamente', data: product });
    } catch (error) {
        console.error('Error al dar de baja el producto: ', error);
        return res.status(500).json({ message: 'Error al dar de baja el producto' });
    }
};