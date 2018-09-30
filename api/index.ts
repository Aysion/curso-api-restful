import { Server } from './server/server';

import { mainRouter } from "./main.router";
import { usersRouter } from "./domain/users/users.router";

const server = new Server();

server.bootstrap([
	mainRouter,
	usersRouter,
]).then((serve) => {
	console.log(server.application.address());
}).catch((err) => {
	console.error("\x1b[41m%s\x1b[0m", err);
	process.exit(1);
});
