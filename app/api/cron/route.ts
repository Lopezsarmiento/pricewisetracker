import { connectToDatabase } from "@/lib/mongoose"
import Product from "@/lib/models/product.model"
import { scrapeAmazonProduct } from "@/lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { NextResponse } from "next/server";


export const maxDuration = 60;
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET () {
  try {

    connectToDatabase()

    const products = await Product.find({})

    if (!products) throw new Error('No products found');

    // 1. SCRAPE PRODUCT DETAILS AND UPDATE DB
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

        if (!scrapedProduct) throw new Error('No product found');

        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          { price: scrapedProduct.currentPrice }
        ];
  
        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        const updatedProduct = await Product.findOneAndUpdate({ url: product.url }, product);

        // 2. check product status and send email if necessary
        const emaiNotifType = getEmailNotifType(scrapedProduct, currentProduct);

        if (emaiNotifType && updatedProduct.users.length > 0) {

          const productInfo = {
            title: updatedProduct.title,
            url : updatedProduct.url,
          }

          const emailContent = await generateEmailBody(productInfo, emaiNotifType);
          const userEmails = updatedProduct.users.map((user: any) => user.email);

          await sendEmail(emailContent, userEmails);

        }

        return updatedProduct;
      })
    )


    // 3. return updated products
    return NextResponse.json({
      message: 'ok',
      data: updatedProducts,
    });


  } catch (error) {
    throw new Error(`Error in cron GET: ${error}`)
  }
}