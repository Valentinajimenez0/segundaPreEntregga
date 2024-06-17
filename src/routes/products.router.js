import { Router } from "express";
import productModel from "../models/product.model.js";
import mongoose from "mongoose";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query, categories } = req.query;

        const filter = {};
        if (query) {
            filter.$or = [
                { title: new RegExp(query, 'i') },
                { description: new RegExp(query, 'i') },
            ];
        }
        if (categories) {
            filter.category = { $in: categories.split(',') };
        }

        const sortOptions = {};
        if (sort) {
            sortOptions.price = sort === 'asc' ? 1 : -1;
        }

        const products = await productModel.paginate(filter, {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sortOptions,
        });

        res.json({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            page: products.page,
            hasNextPage: products.hasNextPage,
            hasPrevPage: products.hasPrevPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
        });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ status: "error", error: "Error interno del servidor" });
    }
});

router.get('/categories', async (req, res) => {
    try {
        const categories = await productModel.distinct('category');
        res.json({ status: 'success', categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al obtener las categorías' });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const pId = req.params.pid;

        if (!mongoose.Types.ObjectId.isValid(pId)) {
            return res.status(400).send({ status: "error", error: "ID inválido" });
        }

        const objectId = new mongoose.Types.ObjectId(pId);
        const product = await productModel.findById(objectId);

        if (!product) {
            return res.status(404).send({ status: "error", error: "Producto no encontrado" });
        }

        res.render('productDetail', {
            id: product._id,
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock
        });
    } catch (error) {
        console.error("No se pudo obtener el producto por ID", error);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});


router.get("/addProduct", async (req, res) => {
    try {
        res.render('addProduct');
    } catch (error) {
        console.error("No se pudo renderizar la vista", error);
    }
})

router.post("/addProduct", async (req, res) => {
    try {
        let { title, description, category, price, thumbnail, code, stock, status } = req.body;
        if (!title || !description || !category || !price || !thumbnail || !code || !stock ) {
            return res.status(400).send({ status: "error", error: "Algunos parámetros están vacíos" });
        }

        let result = await productModel.create({ title, description, category, price, thumbnail, code, stock, status });
        res.redirect("/products");
    } catch (error) {
        console.error("No se pudo agregar el producto", error);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

router.get("/delete", async (req, res) => {
    try {
        res.render('deleteProduct');
    } catch (error) {
        console.error("No se pudo renderizar la vista", error);
    }
})

router.delete("/delete/:pid", async (req, res) => {
    let { pid } = req.params;
    let result = await productModel.deleteOne({ _id: pid });
    res.send({ result: "success", payload: result });
})

export default router;