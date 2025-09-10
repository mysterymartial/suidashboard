import React from 'react'

const CardComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border border-[#e8e8e8] rounded-[10px] p-4">
        {children}
    </div>
  )
}

export default CardComponent