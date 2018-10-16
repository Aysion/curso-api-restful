import { Request, Response, Next } from 'restify';
import { NotFoundError, GoneError } from "restify-errors";
import { Router } from "./router";
import mongoose from "mongoose";

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
	constructor(protected model: mongoose.Model<D>) {
		super();
	}

	validateId = (req: Request, resp: Response, next: Next) => {
		if (mongoose.Types.ObjectId.isValid(req.params.id)) {
			next();
		} else {
			next(new NotFoundError("Document not found"));
		}
	}

	findAll = (req: Request, resp: Response, next: Next) => {
		this.model.find()
		.then(this.renderAll(req, resp, next))
		.catch(next);
	}

	findById = (req: Request, resp: Response, next: Next) => {
		this.model.findById(req.params.id)
		.then(this.render(req, resp, next))
		.catch(next);
	}

	save = (req: Request, resp: Response, next: Next) => {
		let document = new this.model(req.body);

		resp.statusCode = 201;

		document.save()
		.then(this.render(req, resp, next))
		.catch(next);
	}

	replace = (req: Request, resp: Response, next: Next) => {
		this.model.updateOne({
			_id: req.params.id,
		}, {$set:  req.body}, {
			runValidators: true,
			overwrite: true,
		})
		.exec()
		.then((result) => {
			if (!result.n) {
				throw new NotFoundError("Documento não encontrado");
			}

			return this.model.findById(req.params.id);
		})
		.then(this.render(req, resp, next))
		.catch(next);
	}

	update = (req: Request, resp: Response, next: Next) => {
		this.model.findOneAndUpdate({
			_id: req.params.id,
		}, {$set:  req.body}, {
			runValidators: true,
			new: true,
		})
		.then(this.render(req, resp, next))
		.catch(next);
	}

	delete = (req: Request, resp: Response, next: Next) => {
		this.model.deleteOne({
			_id: req.params.id,
		})
		.exec()
		.then((result: any) => {
			if (result.n) {
				resp.statusCode = 204;
			} else {
				throw new GoneError("Registro removido");
			}

			return result;
		})
		.then(this.render(req, resp, next))
		.catch(next);
	}
}
