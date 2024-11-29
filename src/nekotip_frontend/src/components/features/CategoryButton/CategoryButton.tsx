import React from 'react'

const NameCategory = ['Streaming', 'Commissions', 'Gaming', 'Cosplay', 'Art', 'Music', 'Photography']

const CategoryButton = () => {
  return (
    <button className='border-2 border-border text-4E4C47 font-bold px-10 py-1 bg-FFE4E1 cursor-pointer hover:bg-FEC2C3 active:bg-F0AAAB transition-colors duration-300'>streaming</button>
  )
}

export default CategoryButton