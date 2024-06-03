// import cartModel from '../models/cart.model.js'

// export class CartManager {

//     async getCarts() {
//         try {
//             return await cartModel.find().populate('products.product').lean();
//         } catch (error) {
//             console.error("Error al obtener los carritos", error);
//             throw error;
//         }
//     }

//     async getCartProducts(id){
//         try {
//             const cart = await cartModel.findbyCartId(id).populate('products.product').lean();
//             if (cart) {
//                 return cart.products;
//             }else {
//                 console.log("error, no se encontro el carrito");
//                 return null;
//             }
//         } catch (error) {
//             console.error("Error al obtener los productos del carrito", error);

//         }
//     }

//     async newCart () {
//         try {
//             const newCart = new cartModel({products: [],})
//             await newCart.save();
//             return newCart
//         } catch (error) {
//             console.error("error al crear el carrito", error);
//             throw error
//         }
//     }

//     async addProductToCart (cart_id, product_id) {

//         try {
//             const cart = await cartModel.findbyId(cart_id);
//             cart.products.push({ product: product_id, quantity: 1 });
//             await cart.save();
//             console.log(" producto agregado correctamente");
//         } catch (error) {
//             console.log(error, "error al agregar producto al carrito");
//             throw error;
//         }
//     }

//     async updateProductQuantity (product_id, quantity, cart_id) {

//         try {
//             const cart = await cartModel.findById(cart_id);
//             if (cart) {
//                 const productIndex = cart.products.findIndex(p => p.product.equals(product_id));
//                 if (productIndex !== -1) {
//                     cart.products[productIndex].quantity = quantity;
//                     await cart.save();
//                 } else {
//                     console.log("Producto no encontrado en el carrito");
//                 }
//             } else {
//                 console.log("Carrito no encontrado");
//             }
//         } catch (error) {
//             console.error("Error al actualizar la cantidad del producto en el carrito", error);
//             throw error;
//         }
//     }
//     async deleteProductFromCart(cart_id, product_id) {
//         try {
//             const cart = await cartModel.findById(cart_id);
//             if (cart) {
//                 cart.products = cart.products.filter(p => !p.product.equals(product_id));
//                 await cart.save();
//                 console.log("Producto eliminado con éxito");
//             } else {
//                 console.log("Carrito no encontrado");
//             }
//         } catch (error) {
//             console.error("Error al eliminar producto del carrito", error);
//             throw error;
//         }
//     }

//     async clearCart(cart_id) {
//         try {
//             const cart = await cartModel.findById(cart_id);
//             if (cart) {
//                 cart.products = [];
//                 await cart.save();
//                 console.log("Carrito vaciado con éxito");
//             } else {
//                 console.log("Carrito no encontrado");
//             }
//         } catch (error) {
//             console.error("Error al vaciar el carrito", error);
//             throw error;
//         }
//     }
// }





// import cartModel from '../models/cart.model.js'
// import productModel from '../models/product.model.js'

// export const getCart = async (req, res) => {
//     try {
//         const { cid } = req.params
//         const cart = await cartModel.findById(cid).populate('products.product').lean()
//         if (!cart) {
//             return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
//         }
//         res.json({ status: 'success', message: 'Carrito', data: cart  })
//     } catch (err) {
//         res.status(500).json({ status: 'error', message: err.message })
//     }
// }

// export const addProductToCart = async (req, res) => {
//     const { cid, pid } = req.params
//     const { cantidad } = req.body

//     try {
//         const cart = await cartModel.findById(cid)
//         if (!cart) {
//             return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
//         }

//         const product = await productModel.findById(pid)
//         if (!product) {
//             return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
//         }

//         const productIndex = cart.products.findIndex(item => item.product.toString() === pid)
//         if (productIndex > -1) {
//             cart.products[productIndex].quantity += parseInt(cantidad) || 1
//         } else {
//             cart.products.push({ product: pid, quantity: parseInt(cantidad) || 1 })
//         }

//         await cart.save()
//         res.json({ status: 'success', message: 'Producto agregado al carrito' })
//     } catch (err) {
//         res.status(500).json({ status: 'error', message: err.message })
//     }
// }

// export const updateProductQuantity = async (req, res) => {
//     try {
//         const { cid, pid } = req.params
//         const { quantity } = req.body

//         const quantityNumber = parseInt(quantity, 10)
//         if (isNaN(quantityNumber) || quantityNumber <= 0) {
//             return res.status(400).json({ status: 'error', message: 'Cantidad inválida' })
//         }

//         const cart = await cartModel.findById(cid)
//         if (!cart) {
//             return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
//         }

//         const productIndex = cart.products.findIndex(p => p.product.toString() === pid)

//         if (productIndex > -1) {
//             cart.products[productIndex].quantity += quantityNumber
//         } else {
//             cart.products.push({ product: pid, quantity: quantityNumber })
//         }

//         await cart.save()

//         res.json({ status: 'success', message: 'Cantidad actualizada' })
//     } catch (err) {
//         res.status(500).json({ status: 'error', message: err.message })
//     }
// }

// export const deleteProductFromCart = async (req, res) => {
//     try {
//         const { cid, pid } = req.params
//         await cartModel.updateOne({ _id: cid }, { $pull: { products: { product: pid } } })
//         res.json({ status: 'success', message: 'Producto eliminado del carrito' })
//     } catch (err) {
//         res.status(500).json({ status: 'error', message: err.message })
//     }
// }

// export const deleteAllProductsFromCart = async (req, res) => {
//     try {
//         const { cid } = req.params
//         await cartModel.updateOne({ _id: cid }, { $set: { products: [] } })
//         res.json({ status: 'success', message: 'Todos los productos eliminados del carrito' })
//     } catch (err) {
//         res.status(500).json({ status: 'error', message: err.message })
//     }
// }

