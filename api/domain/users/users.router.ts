import * as restify from "restify";
import { NotFoundError, GoneError } from "restify-errors";
import { Router } from "../../common/router";
import { User } from "./users.model";

class UsersRouter extends Router {
	applyRoutes(application: restify.Server) {

		application.get('/users', (req, resp, next) => {
			User.find()
			.then(this.respJson(req, resp, next))
			.catch(next);
		});

		application.get('/users/:id', (req, resp, next) => {
			User.findById(req.params.id)
			.then(this.respJson(req, resp, next))
			.catch(next);
		});

		application.post('/users', (req, resp, next) => {
			let user = new User(req.body);

			resp.statusCode = 201;

			user.save()
			.then(data => {
				if (data && data.password) {
					delete data.password;
				}

				return data;
			})
			.then(this.respJson(req, resp, next))
			.catch(next);
		});

		application.put('/users/:id', (req, resp, next) => {

			User.update({
				_id: req.params.id,
			}, req.body, {
				overwrite: true,
			})
			.exec()
			.then(result => {
				if (result.n) {
					return User.findById(req.params.id);
				}

				throw new NotFoundError("Documento não encontrado");

				return result;
			})
			.then(this.respJson(req, resp, next))
			.catch(next);
		});

		application.patch('/users/:id', (req, resp, next) => {

			User.findOneAndUpdate({
				_id: req.params.id,
			}, req.body, {
				new: true,
			})
			.then(this.respJson(req, resp, next))
			.catch(next);
		});

		application.del('/users/:id',  (req, resp, next) => {
			User.deleteOne({
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
			.then(this.respJson(req, resp, next))
			.catch(next);
		});
	}
}

export const usersRouter = new UsersRouter();
