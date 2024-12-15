import { FC, useState } from 'react'
import { useDraw } from '../hooks/useDraw'
import { ChromePicker } from 'react-color'

import { Draw } from '../types/typing.d.tsx'

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  
  const [color, setColor] = useState<string>('#000')
  const {canvasRef, onMouseDown, clear} = useDraw(drawLine)

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint
    const lineColor = color // Color should be the same as the state we set before 
    const lineWidth = 5

    // We want to draw a line between the current point and the previous point.
    //  This is because if we simply draw at the current point, there will be too much
    //  space between each point when we move the mouse very fast and our drawing will
    //  appear messy.
    let startPoint = prevPoint ?? currentPoint  // If there is no previous point, use the current point as the start point
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = lineColor
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(currX, currY)
    ctx.stroke()  // This method draws the current path
    
    ctx.fillStyle = lineColor
    ctx.beginPath()
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI)
    ctx.fill()
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