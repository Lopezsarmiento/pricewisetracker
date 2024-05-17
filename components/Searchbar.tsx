"use client"
import { FormEvent, useState } from "react"
import { scrapeAndStoreProduct } from "../lib/actions";

const isValidAmazonProductUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname;

    if (hostname.includes('amazon') || hostname.includes('amazon.com') || hostname.includes('amazon.')) {
      return true
    }
    
  } catch (error) {
     return false
  }
}

  


export const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    console.log('searching...')
    event.preventDefault()
    const isValidLink = isValidAmazonProductUrl(searchPrompt)
    if (!isValidLink) {
      console.log('Invalid link')
      return
    }

    try {
      setIsLoading(true)
      // scrape product page data
      const product = await scrapeAndStoreProduct(searchPrompt);

    } catch (error) {
      
    } finally {
      setIsLoading(false)
    }



  }

  return (
    <form 
      className='flex flex-wrap gap-4 mt-12'
      onSubmit={handleSubmit}
    >
      <input
        type='text'
        value={searchPrompt}
        placeholder='enter product link'
        className='searchbar-input'
        onChange={(e) => setSearchPrompt(e.target.value)}
      />
      <button
        type='submit'
        className='searchbar-btn'
        disabled={isLoading}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}
