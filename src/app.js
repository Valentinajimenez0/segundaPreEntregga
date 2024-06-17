import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import handlebars from 'express-handlebars';
import path from 'path'
import { fileURLToPath } from 'url'

import dirname from './utils.js';
import userRouter from './routes/users.router.js'
import indexRouter from './routes/index.router.js'
import productRouter from './routes/products.router.js';
import messagesRouter from './routes/messages.router.js';
import cartsRouter from './routes/carts.router.js';

dotenv.config()

/* const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename) */

const app = express();
const PORT = 8080

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

mongoose.connect(process.env.MONGO_URI)

.then (()=> {console.log("conectado")})
.catch (() => {console.error("errorr")})

    app.engine('handlebars', handlebars.engine())
    app.set('view engine', 'handlebars')
    app.set('views', path.join(dirname, 'views'))

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.static(path.join(dirname, 'public')))

app.use('/api/users', userRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)
app.use('/', indexRouter)

app.listen(PORT, () => {
    console.log('listening on port http://localhost:8080');
});