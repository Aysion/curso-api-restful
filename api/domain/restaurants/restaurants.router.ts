import { Server, Request, Response, Next } from 'restify';
import { ModelRouter } from "../../common/model-router";
import { Restaurant } from "./restaurants.model";
import { NotFoundError } from 'restify-errors';

class RestaurantsRouter extends ModelRouter<Restaurant> {
	constructor() {
		super(Restaurant);

		this.on("beforeRender", function(document) {

			return document;
		});
	}

	findMenu = (req: Request, resp: Response, next: Next) => {
		Restaurant.findById(req.params.id, "+menu")
		.then(rest => {
			if (rest) {
				resp.json(rest.menu);
				return next();
			}

			throw new NotFoundError("Restaurant not found");
		}).catch(next);
	};

	replaceMenu = (req: Request, resp: Response, next: Next) => {
		Restaurant.findById(req.params.id)
		.then(rest => {
			if (rest) {
				rest.menu = req.body; //ARRAY de MenuItem

				return rest.save();
			}

			throw new NotFoundError("Restaurant not found");
		})
		.then(rest => {
			resp.json(rest.menu);

			return next();
		})
		.catch(next);
	};

	applyRoutes(application: Server) {
		application.get('/restaurants', this.findAll);
		application.get('/restaurants/:id', [this.validateId, this.findById]);
		application.post('/restaurants', this.save);
		application.put('/restaurants/:id', [this.validateId, this.replace]);
		application.patch('/restaurants/:id', [this.validateId, this.update]);
		application.del('/restaurants/:id', [this.validateId, this.delete]);

		application.get('/restaurants/:id/menu', [this.validateId, this.findMenu]);
		application.put('/restaurants/:id/menu', [this.validateId, this.replaceMenu]);
	}
}

export const restaurantsRouter = new RestaurantsRouter();
