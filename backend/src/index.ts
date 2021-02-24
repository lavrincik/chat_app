import cors from 'cors';
import express from 'express';
import "reflect-metadata";
import { createConnection } from 'typeorm';
import routers from './routes/routers';
import sockets from './sockets/socket';

createConnection()
	.then(async () =>{
		const socketsApp = sockets();
		const socketsPort = 3001;

		const expressApp = express();
		expressApp.use(cors());
		expressApp.use(express.json());

		const expressPort = 3000;
		
		for (const router of routers) {
			expressApp.use('/', router);
		}
		
		socketsApp.listen(socketsPort);
		expressApp.listen(expressPort);
	}).catch(error => {
		console.log(error);
	})
  
