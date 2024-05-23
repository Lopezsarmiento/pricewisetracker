import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractCurrency, extractPrice, extractDescription } from '../utils';

export async function scrapeAmazonProduct(productUrl: string) {
  if (!productUrl) return;

  // brightdata proxy configuration
  const username = String(process.env.BRIGHTDATA_USERNAME);
  const password = String(process.env.BRIGHTDATA_PASSWORD);
  const port = 9222;
  const session_id = (1000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false
  };


  try {
    const response = await axios.get(productUrl, options);
    const $ = cheerio.load(response.data);

    const title = $('#productTitle').text().trim();
    // const currentPrice = extractPrice(
    //   $('.aok-offscreen'),
    // );
    const currentPrice = extractPrice(
      $('.priceToPay span.a-price-whole'),
      $('.a.size.base.a-color-price'),
      $('.a-button-selected .a-color-base'),
    );
    const originalPrice = extractPrice(
      $('#priceblock_ourprice'),
      $('.a-price.a-text-price span.a-offscreen'),
      $('#listPrice'),
      $('#priceblock_dealprice'),
      $('.a-size-base.a-color-price')
    );
    const outOfStock = $('#availability').text().trim().toLowerCase() === 'currently unavailable';
    const images = $('#landingImage').attr('data-a-dynamic-image') || $('#imgBlkFront').attr('data-a-dynamic-image ');
    const imageUrls = Object.keys(JSON.parse(images as string));
    const currency = extractCurrency($('.a-price-symbol'));
    const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, '');
    const description = extractDescription($);

    // buiild data object
    const scrapedProduct = {
      url: productUrl,
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      outOfStock,
      image: imageUrls[0],
      currency: currency || '$',
      discountRate: Number(discountRate),
      category: 'category here',
      reviewsCount: 100,
      stars: 4.5,
      description,
      priceHistory: [],
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: (Number(currentPrice) ||  Number(originalPrice)),
    }

    console.log('scrapedProduct::', scrapedProduct);
    return scrapedProduct;
    
  } catch (error) {
    throw new Error(`Failed to scrape product: ${(error as Error).message}`)
  }




}