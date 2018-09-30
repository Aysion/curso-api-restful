import * as restify from "restify";
import { Router} from "./common/router";

class MainRouter extends Router {
	applyRoutes(application: restify.Server) {
		application.get('/', (req, resp, next) => {
			resp.json({
				id: req.getId(),
				browserReq: req.headers,
				browserResp: resp.getHeaders(),
				agent: req.userAgent(),
				http: req.method,
				path: req.getPath(),
				url: req.getHref(),
				getQuery: req.getQuery(),
				query: req.query,
			});

			return next();
		});
	}
}

export const mainRouter = new MainRouter();
