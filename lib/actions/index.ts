"use server"
import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDatabase } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl: string) {

  if (!productUrl) return;

  try {

    connectToDatabase();


    const scrapedProduct = await scrapeAmazonProduct(productUrl);

    if (!scrapedProduct) return;


    // find product in database or create a new one
    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      // update price history
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice }
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    const newProduct = await Product.findOneAndUpdate({ url: scrapedProduct.url }, product, { upsert: true, new: true })

    revalidatePath(`/product/${newProduct._id}`);

  } catch (error) {
    throw new Error(`Failed to create/update product: ${(error as Error).message}`)
  }
}

export const getProductById = async (productId: string) => {
  try {
    connectToDatabase();

    const product = await Product.findOne({ _id: productId });
    return product ? product : null;

  } catch (error) {
    console.error(`Failed to get product by id: ${error}`);
  }
};

export const getAllProducts = async () => {
  try {
    connectToDatabase();

    const products = await Product.find();
    console.log('products::::', products);
    return products;
  } catch (error) {
    console.error(`Failed to get all products: ${error}`);
  }
}

export const getSimilarProducts = async (productId: string) => {
  try {
    connectToDatabase();

    const currentProduct = await Product.findById(productId);

    if (!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId }
    }).limit(4);

    return similarProducts;


  } catch (error) {
    console.error(`Failed to get all products: ${error}`);
  }
}


export const addUserEmailToProduct = async (productId: string, userEmail: string) => {
  try {

    console.log(`inside addUserEmailToProduct`);

    const product = await Product.findById(productId);
    if (!product) return;

    const userExists = product.users.some((user: User) => user.email === userEmail);

    console.log(`userExists: ${userExists}`);

    if (!userExists) {
      product.users.push({ email: userEmail});
      await product.save();

      console.log(`Email ${userEmail} added to product ${product.title}`);


      const emailContent = await generateEmailBody(product, "WELCOME");
      console.log(`emailContent: ${emailContent}`);
      await sendEmail(emailContent, [userEmail]);
    }

    // TODO: indicate user that email is already added to product


  } catch (error) {
    console.error(`Failed to add email to product: ${error}`);
  }
} 