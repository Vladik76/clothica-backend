import { connectMongoDB } from '../db/connectMongoDB.js';
import Category from '../models/category.js';
import Product from '../models/product.js';

async function run() {
  await connectMongoDB();
  await Category.deleteMany({});
  await Product.deleteMany({});

  const cat = await Category.create({ name: 'T-Shirts', slug: 't-shirts', imageUrl: '' });
  await Product.create({
    categoryId: cat._id,
    name: 'Basic Tee',
    slug: 'basic-tee',
    price: 19.99,
    images: [],
    description: 'A simple t-shirt',
    variants: [{ size: 'M', color: 'Black', stock: 10 }]
  });

  console.log('Seed done');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
