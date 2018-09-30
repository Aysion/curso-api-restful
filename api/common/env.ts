export const env = {
	server: {
		port: process.env.PORT || 3000,
	},
	db: {
		url: process.env.DB_URL || "mongodb://mongodb:27017/meat-api",
	}
};
