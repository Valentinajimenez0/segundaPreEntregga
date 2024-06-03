import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'productos';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 100 },
    price: { type: Number, required: true, min: 1 },
    thumbnail: { type: String, required: true },
    code: { type: String, required: true, max: 20, unique: true },
    stock: { type: Number, required: true, min: 1, max: 100 },
    status: { type: Boolean, required: true, default: true },
    category: { type: String, required: true }
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
