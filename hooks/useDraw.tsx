import { useEffect, useRef } from "react"

export const useDraw = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {

        const handler = (e: MouseEvent) => {

        }

        // Add event listeners
        canvasRef.current?.addEventListener('mousemove', e => handler)
        
    }, [])

    return  { canvasRef }
}