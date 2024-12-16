import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  status: { type: String, required: true },
  category:{type:String,required:true},
  brand:{type:String,required:true},
  popularity:{type:Number , default :0},
  imageUrls: { type: [String], required: true }, 
},{
    timestamps: true,
});

const productModel = mongoose.model('Product', productSchema);
export default productModel;
