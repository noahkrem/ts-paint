// @ts-expect-error import React is recognized as declared but never used by TypeScript
import React, { FC, useState } from 'react'
import { useDraw } from '../hooks/useDraw'
import { ChromePicker } from 'react-color'
import { io } from "socket.io-client"

import { Draw } from '../types/typing.d.tsx'

// Hosted on port 3001
const socket = io('http://localhost:3001')

type pageProps = object;

// eslint-disable-next-line no-empty-pattern
const page: FC<pageProps> = ({}) => {
  
  const [color, setColor] = useState<string>('#000')
  const {canvasRef, onMouseDown, clear} = useDraw(drawLine)

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {}

  // Two main purposes:
  // 1. Emit to the server
  function createLine({ prevPoint, currentPoint, ctx }: Draw) {}

  return ( 
    <div className='w-screen h-screen bg-white flex justify-center items-center'>
      <div className='flex flex-col gap-10 pr-10'>
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)}/>
        <button type='button' className='p-2 rounded-md border border-black' onClick={clear}>
          Clear canvas
        </button>
      </div>
      <canvas onMouseDown={onMouseDown} ref={canvasRef} width={750} height={750} className='border border-black rounded-md'/>
    </div>
  )
}

export default page