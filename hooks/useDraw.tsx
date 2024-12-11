import { useEffect, useRef } from "react"

export const useDraw = (onDraw: ({ctx, currentPoint, prevPoint}: Draw)) => {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {

        const handler = (e: MouseEvent  ) => {
            const currentPoint = computePointInCanvas(e)
            console.log(currentPoint?.x, currentPoint?.y)

            // Context of the canvas
            const ctx = canvasRef.current?.getContext('2d')
            if (!ctx || !currentPoint) return   // If there is no context or current point return

        }

        const computePointInCanvas = (e: MouseEvent) => {
            const canvas = canvasRef.current 
            if (!canvas) return // If canvas is Null, return

            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            return { x, y }
        }

        // Add event listeners
        canvasRef.current?.addEventListener('mousemove', handler)

        // Remove event listeners
        return () => canvasRef.current?.addEventListener('mousemove', handler)
    }, [])

    return  { canvasRef }
}