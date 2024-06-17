import {Router} from "express"

const router = Router();

router.get("/", async (req, res) => {
    try {
        res.render('home');
    } catch (error) {
        console.error("error", error);
    }
})

router.get("/products", async (req, res) => {
    try {
        res.render('products', {
        })
    } catch (error) {
        console.error('Error al obtener el carrito:', error)
        res.status(500).render('products', { error: error.message })
    }
})

export default router;