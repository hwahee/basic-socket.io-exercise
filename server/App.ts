import express from 'express'
import http, { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import fs from 'fs'

const httpServer: http.Server = createServer()
const io: Server = new Server(httpServer, {

})

class BombGame {
	private now: number=0
	private max: number
	private socket: Socket
	constructor(socket: Socket, max: number) {
		this.socket = socket
		this.max = max
	}
	private init() {
		this.now = 0
	}
	public changeMax(max: number) { this.max = max }
	public heat(deg: number): boolean {
		this.now += deg
		if (this.max <= this.now) {
			this.socket.emit("boom", "Bomb Boomed!")
			this.init()
		}
		else{
			this.socket.emit("boom", "Nothing interesting happened.")
		}
		return false
	}
}

io.on('connection', (socket) => {
	console.log('connection from:')
	console.log(socket.handshake.query)

	socket.on('knock', (data) => {
		console.log(`knock: ${data}`)
	})

	socket.on('tell_txt', (data: string) => {
		console.log(`tell_txt: ${data}`)
	})


	
	const BG: BombGame = new BombGame(socket, 120)

	socket.on('heat_bomb', (data:string)=>{
		console.log(`heat_bomb: ${data}`)
		BG.heat(parseInt(data))
	})

})

const PORT: number = 2002
httpServer.listen(PORT, () => {
	console.log(`socket.io listening on port: ${PORT}`)
})