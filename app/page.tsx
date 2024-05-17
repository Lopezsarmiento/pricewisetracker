import HeroCarousel from '@/components/HeroCarousel'
import { Searchbar } from '@/components/Searchbar'
import Image from 'next/image'
import React from 'react'

const Home = () => {
  return (
    <>
      <section className='px-6 md:px-20 py-24'>
        <div className='flex max-xl:flex-col gap-16'>
          <div className='flex flex-col justify-center'>
            <p className='small-text'> 
              Smart shopping starts here:
              <Image src='/assets/icons/arrow-right.svg' alt='arrow' width={16} height={16} />
            </p>
            <h1 className='head-text'>
              Unleash the power of
              <span className='text-primary'> Pricewise</span>
            </h1>
            <p className='mt-6'>
              Get the best deals on your favorite products. 
              Compare prices from different stores and make the best decision.
            </p>
            <Searchbar />
          </div>
          <HeroCarousel />
          <Image
            src="/assets/icons/hand-drawn-arrow.svg" 
            alt="arrow" 
            width={175} 
            height={175} 
            className='max-xl:hidden absolute left-[45%] bottom-12 z-0'
          />
        </div>
      </section>
      <section className='trending-section'>
        <h2 className='section-text'>Trending Products</h2>
        <div className='flex flex-wrap gap-x-8 gap-y-16'>
          {['Apple Iphone 15', 'Samsung Galaxy S22', 'Xiaomi Redmi Note 11', 'Oneplus 10'].map((product, index) => (
            <div>{product}</div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Home