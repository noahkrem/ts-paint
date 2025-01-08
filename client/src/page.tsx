// @ts-expect-error import React is recognized as declared but never used by TypeScript
import React, { FC, useEffect, useState } from 'react'
import { useDraw } from '../hooks/useDraw'
import { ChromePicker } from 'react-color'
import { io } from "socket.io-client"
import { drawLine } from '../utils/drawLine'

import { Draw, Point } from '../types/typing.d.tsx'

// Hosted on port 3001
const socket = io('http://localhost:3001')

// 'Props' are Properties
type pageProps = object;

type drawLineProps = {
  prevPoint: Point | null
  currentPoint: Point
  color: string
}

// eslint-disable-next-line no-empty-pattern
const page: FC<pageProps> = ({}) => {
  
  const [color, setColor] = useState<string>('#000')
  const {canvasRef, onMouseDown, clear} = useDraw(createLine)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')

    socket.on('draw-line', ({ prevPoint, currentPoint, color }: drawLineProps) => {
      if (!ctx) return  // If ctx does not exist, do not draw
      drawLine({ prevPoint, currentPoint, ctx, color })
    })
  }, [])

  // Two main purposes:
  // 1. Emit to the server
  // 2. Call the function to draw the line
  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit('draw-line', ({prevPoint, currentPoint, color}))  // 'draw-line' is the name of the event that we are listening for on the server side
    drawLine({ prevPoint, currentPoint, ctx, color })  // Call the function where we actually draw the line 
  }

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