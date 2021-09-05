import express from 'express'
import {io} from 'socket.io-client'
import bodyParser from 'body-parser'

const app=express()
const PORT:number=8080

const socket=io(`http://localhost:2002`, {
	query:{
		hello:"merhaba"
	}
})

app.use(bodyParser.urlencoded({extended:false}))

app.get('/', (req, res)=>{
	console.log(`req from: ${req.ip}`)
	res.sendFile(__dirname+`/index.html`)
})
app.get('/knock', (req, res)=>{
	console.log(`knock from: ${req.ip}`)
	socket.emit('knock', "in-code message")
	res.send('')
})
app.post('/tell_txt', (req, res)=>{
	console.log(`post tell_txt req from: ${req.ip}`)
	console.log(req.body)
	
	socket.emit('tell_txt', req.body.elem)
})
app.post('/heat_bomb', (req, res)=>{
	console.log(`post tell_txt req from: ${req.ip}`)
	console.log(req.body)
	
	socket.emit('heat_bomb', req.body.elem)
	socket.once('boom', (data)=>{
		res.send(data)
	})
})

app.listen(PORT, ()=>{
	console.log(`Server Running: ${PORT}`)
})