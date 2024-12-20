const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)

import { Server } from 'socket.io'

const io = new Server(server, {
    cors: {
        origin: '*',    // At production level we wouldn't want * to be our origin, but in our local project it is fine.
                        // Simply means that we are allowing anybody to access our server.
    },
})

type Point = {x: number, y: number}

type DrawLine = {
    prevPoint: Point | null
    currentPoint: Point
    color: string
}

io.on('connection', (socket) => {   // Whenever a WebSocket (or Client) connects...
    socket.on('draw-line', ({ prevPoint, currentPoint, color }: DrawLine) => {  // draw-line is the event we are going to fire from the client
        socket.broadcast.emit('draw-line', { prevPoint, currentPoint, color })  // Emit the draw-line instance to all other clients (but not the client who drew the line)
    })  
})   