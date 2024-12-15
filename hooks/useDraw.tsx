import { useEffect, useRef, useState } from "react"
import { Draw, Point } from '../types/typing.d.tsx'

export const useDraw = (onDraw: ({ctx, currentPoint, prevPoint}: Draw) => void) => { 

    const [mouseDown, setMouseDown] = useState(false)  // Only draw when the mouse is pressed down
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const prevPoint = useRef<null | Point>(null)

    const onMouseDown = () => setMouseDown(true)    // Passing this frome the canvas

    const clear = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    useEffect(() => {

        const handler = (e: MouseEvent  ) => {

            if (!mouseDown) return  // If mouse is not pressed don't draw anything

            const currentPoint = computePointInCanvas(e)
            console.log(currentPoint?.x, currentPoint?.y)

            // Context of the canvas
            const ctx = canvasRef.current?.getContext('2d')
            if (!ctx || !currentPoint) return   // If there is no context or current point return

            // Here onDraw uses JS object destructuring with aliasing.
            //  The code is looking for a property called prevPoint in the object being passed to the onDraw function,
            //  The value of prevPoint is assigned to prevPoint.current instead of just prevPoint,
            //  And inside the function the variable prevPoint will now refer to prevPoint.current.
            // React refs are objects that have a 'current' property used to store mutable values
            onDraw({ ctx, currentPoint, prevPoint: prevPoint.current })
            prevPoint.current = currentPoint    // Current point becomes previous point
        }

        const computePointInCanvas = (e: MouseEvent) => {
            const canvas = canvasRef.current 
            if (!canvas) return // If canvas is Null, return

            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            return { x, y }
        }

        const mouseUpHandler = () => {
            setMouseDown(false)
            prevPoint.current = null
        }

        // Add event listeners
        canvasRef.current?.addEventListener('mousemove', handler)
        window.addEventListener('mouseup', mouseUpHandler)  // Must attach this to the window, not the canvas, or else 
                                                            //  our program won't know if the mouse was released outside of the canvas

        // Remove event listeners
        return () => {
            canvasRef.current?.removeEventListener('mousemove', handler)
            window.removeEventListener('mouseup', mouseUpHandler)
        }
    }, [onDraw])    // Must inlude onDraw in the dependency array since we are not defining it within the useEffect function

    return  { canvasRef, onMouseDown, clear }
}