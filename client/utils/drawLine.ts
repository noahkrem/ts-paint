//type DrawLineProps = Draw & {

//}

export const drawLine = ({ prevPoint, currentPoint, ctx, color }: DrawLineProps) => {   // Props are read-only inputs passed to a React component
    const { x: currX, y: currY } = currentPoint
    const lineColor = color // Color should be the same as the state we set before 
    const lineWidth = 5

    // We want to draw a line between the current point and the previous point.
    //  This is because if we simply draw at the current point, there will be too much
    //  space between each point when we move the mouse very fast and our drawing will
    //  appear messy.
    const startPoint = prevPoint ?? currentPoint  // If there is no previous point, use the current point as the start point
                                                  // Since startPoint never changes within the function, we can declare it as const
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
