import { Server, Request, Response, Next } from 'restify';
import { NotFoundError } from "restify-errors";
import { Error, Document } from 'mongoose';

export abstract class Router {
	abstract applyRoutes(application: Server): any;

	respJson(req: Request, resp: Response, next: Next): any {
		return (document: Document) => {
			if (document) {
				resp.json(document);
				return next();
			} else {
				return next(new NotFoundError("Documento não encontrado"));
			}
		};
	}

}
