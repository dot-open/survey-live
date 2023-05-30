import path from 'path';
import express, { Express } from 'express';
import { Server } from 'socket.io';
import * as http from 'http';

export default class LiveServer {
	isStarted: boolean = false;
	port: number;
	express: Express;
	http: http.Server;
	socket: Server;
	constructor(port: number = 3000) {
		this.port = port;
	}
	initExpress() {
		this.express = express();
		this.express.use(express.static(path.join(__dirname, '..', 'public')));
	}
	initHttp() {
		this.http = http.createServer(this.express);
		this.http.listen(this.port, () => {
			console.log('listening on *:' + this.port);
		});
	}
	initSocket() {
		this.socket = new Server(this.http);
		this.socket.on('connection', (socket) => {
			console.log('display connected');
			socket.on('disconnect', () => {
				console.log('display disconnected');
			});
		});
	}
	start() {
		if (!this.isStarted) {
			this.initExpress();
			this.initHttp();
			this.initSocket();
			this.isStarted = true;
		}
	}
	stop() {
		if (this.isStarted) {
			this.http.close();
		}
	}
	update(src: string): boolean {
		return this.socket.emit('update', src as any);
	}
}
