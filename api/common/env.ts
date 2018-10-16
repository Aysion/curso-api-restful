export const env = {
	server: {
		port: process.env.PORT || 3000,
	},
	db: {
		url: process.env.DB_URL || "mongodb://mongodb:27017/meat-api",
		crypto: {
			algorithm: "aes256",
			password: "/E//kvpaIudQojetOykzuQ==",
			type: "base64",
			encoding: "utf8",
		}
	}
};
