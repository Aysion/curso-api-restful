import restify from "restify";
import mongoose from "mongoose";

import { env } from "../common/env";
import { Router } from "../common/router";
import { mergePatchBodyParser } from "./merge-patch.parser";
import { handleError } from "./error.handler";

export class Server {

	application: restify.Server;

	constructor() {
		this.application = restify.createServer({
			name: 'meat-api',
			version: '1.0.0',
		});

		// Parser da Query
		this.application.use(restify.plugins.queryParser());
		this.application.use(restify.plugins.bodyParser());
		this.application.use(mergePatchBodyParser);

		this.application.on('restifyError', handleError);

	}

	initializeDb() {
		mongoose.set('useCreateIndex', true);
		mongoose.set('useFindAndModify', false);

		return mongoose.connect(env.db.url, {
			useNewUrlParser: true,
		});
	}

	initRoutes(routers: Router[]): Promise<any> {
		return new Promise((resolve, reject) => {
			try {

				for (let router of routers) {
					router.applyRoutes(this.application);
				}

				resolve(this.application);

			} catch (error) {
				reject(error);
			}
		})
	}

	bootstrap(routers: Router[] = []): Promise<Server> {
		return this.initializeDb()
		.then(() => this.initRoutes(routers))
		.then((application) => application.listen(env.server.port))
		.then(() => this);
	}
}
