// A *.d.ts file contains only type annotations, and is called a 'Typescript Definition' file

export type Draw = {
    ctx: CanvasRenderingContext2D
    currentPoint: Point
    prevPoint: Point | null
}

type Point = { x: number; y: number }