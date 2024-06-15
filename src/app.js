import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/users.router.js'
import productRouter from './routes/products.router.js';
import messagesRouter from './routes/messages.router.js';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import cartsRouter from './routes/carts.router.js';
import indexRouter from './routes/index.router.js'

dotenv.config()

const app = express();
const PORT = 8080

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

 mongoose.connect(process.env.MONGO_URI)
 
 .then (()=> {console.log("conectado")})
 .catch (() => {console.error("errorr")})

app.use('/api/users', userRouter)
// app.use('/api/products', productRouter)
 app.use('/api/messages', messagesRouter)
// app.use('/api/carts', cartRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)
app.use('/', indexRouter)


app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))



app.listen(PORT, () => {
    console.log(`listening on port PORT`);
});