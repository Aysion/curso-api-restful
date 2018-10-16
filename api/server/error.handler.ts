import { Request, Response } from "restify";

export const handleError = (req: Request, resp: Response, err: any, done: any) => {
	console.log("\x1b[35m%s\x1b[0m", ("-").repeat(40));
	console.log("\x1b[31m%s\x1b[0m", JSON.stringify(err));
	console.log(err.stack || "");
	console.log("\x1b[35m%s\x1b[0m", ("-").repeat(40));

	err.toJSON = () => ({
		message: err.message || err.stack || err,
	});

	switch (err.name) {
		case "MongoError": {
			if (err.code === 11000) {
				err.statusCode = 409;
			}
		} break;
		case "ValidationError": {
			err.statusCode = 406;

			const messages: any[] = [];

			for (let name in err.errors) {
				messages.push(err.errors[name].message);
			}

			err.message = messages.join('\n');
		} break;
		case "CastError": {
			err.statusCode = 406;
		} break;
		default:
	}

	return done();
};
