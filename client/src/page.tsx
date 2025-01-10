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

    socket.emit('client-ready')

    socket.on('get-canvas-state', () => {
      if (!canvasRef.current?.toDataURL()) return  // If there is no canvas data to get, do nothing
      console.log('**Sending canvas state**')

      // Essentially all of the data in the canvas is stored into a very long string that we can use to draw on a new canvas
      socket.emit('canvas-state', canvasRef.current.toDataURL())

    })

    socket.on('canvas-state-from-server', (state: string) => {
      console.log(state)
      console.log('**Received state from server**')
      const img = new Image()
      img.src = state
      img.onload = () => {
        ctx?.drawImage(img, 0, 0)
      }
      console.log('**Image created**')
    })

    socket.on('draw-line', ({ prevPoint, currentPoint, color }: drawLineProps) => {
      if (!ctx) return  // If ctx does not exist, do not draw
      drawLine({ prevPoint, currentPoint, ctx, color })
    })

    socket.on('clear', clear) // If 'clear' is received, clear the page

    // We must turn sockets off after turning them on
    return () => {
      socket.off('get-canvas-state')
      socket.off('canvas-state-from-server')
      socket.off('draw-line')
      socket.off('clear')
    }
  }, [canvasRef])

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
        <button type='button' className='p-2 rounded-md border border-black' onClick={() => socket.emit('clear')}>
          Clear canvas
        </button>
      </div>
      <canvas onMouseDown={onMouseDown} ref={canvasRef} width={750} height={750} className='border border-black rounded-md'/>
    </div>
  )
}

export default page