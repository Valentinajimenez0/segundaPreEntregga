
import { Router } from "express"
import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js";
import mongoose from "mongoose";

const router = Router();

router.post('/post', async (req, res) => {
    try {
        const newCart = new cartModel();

        await newCart.save();

        return res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        return res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = "66703c985e7a2c5102422757";

        const cart = await cartModel.findById(cartId).populate({
            path: 'products.product',
            select: 'title description category price code stock status',
            model: productModel
        }).lean();

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.render('cart', { cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const {cantidad} = req.body;

        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'no se encontro el carrito' });
        }

        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === pid);
        if (existingProductIndex !== -1) {

            cart.products[existingProductIndex].quantity += 1;
        } else {

            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();

        res.json({
            status: 'success',
            message: 'Producto agregado al carrito',
            data: { /* datos del carrito actualizados */ }
        });

    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        return res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

router.delete('/delete/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === pid);
        if (existingProductIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        cart.products.splice(existingProductIndex, 1);

        await cart.save();

        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        return res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});

router.put('/put/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ error: 'numero invalido' });
        }

        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const existingProduct = cart.products.find(item => item.product.toString() === pid);
        if (!existingProduct) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        existingProduct.quantity = quantity;

        await cart.save();

        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        return res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});

router.delete('/delete/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        cart.products = [];

        await cart.save();

        return res.status(200).json({ message: 'Todos los productos del carrito han sido eliminados' });
    } catch (error) {
        console.error('Error al eliminar todos los productos del carrito:', error);
        return res.status(500).json({ error: 'Error al eliminar todos los productos del carrito' });
    }
});

export default router;