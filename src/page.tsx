import { FC } from 'react'
import { useDraw } from '../hooks/useDraw'
import { Draw } from '../types/typing.d.tsx'

interface pageProps {}

const page: FC<pageProps> = ({}) => {

  const {canvasRef} = useDraw(drawLine)

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint
    const lineColor = '#000'
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
    

  }

  return <div className='w-screen h-screen bg-white flex justify-center items-center'>
    <canvas ref={canvasRef} width={750} height={750} className='border border-black rounded-md'/>
  </div>
}

export default page