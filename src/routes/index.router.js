import {Router} from "express"

const router = Router();

router.get("/", async (req, res) => {
    try {
        res.render('home');
    } catch (error) {
        console.error("error", error);
    }
})

export default router;