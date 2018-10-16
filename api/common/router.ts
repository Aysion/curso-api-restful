import { Server, Request, Response, Next } from 'restify';
import { NotFoundError } from "restify-errors";
import { Error, Document } from 'mongoose';
import { EventEmitter } from 'events';

export abstract class Router extends EventEmitter{
	abstract applyRoutes(application: Server): any;

	render(req: Request, resp: Response, next: Next): any {
		return (document: Document) => {
			if (document) {
				this.emit("beforeRender", document);
				resp.json(document);
				return next();
			} else {
				return next(new NotFoundError("Documento não encontrado"));
			}
		};
	}

	renderAll(req: Request, resp: Response, next: Next): any {
		return (documents: any[]) => {
			if (documents) {
				documents.forEach(document => this.emit("beforeRender", document));

				resp.json(documents);
			} else {
				resp.json([]);
			}
		};
	}

}
