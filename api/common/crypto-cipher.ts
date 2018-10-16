import crypto from "crypto";

export const createCipher = (text: string, optons: any) => {
	const cipher = crypto.createCipher(optons.algorithm, optons.password);
	cipher.update(text);

	return cipher.final(optons.type).toString();
};

export const createDecipher = (text: string, optons: any) => {
	const cipher = crypto.createDecipher(optons.algorithm, optons.password);
	cipher.update(text, optons.type);

	return cipher.final(optons.encoding).toString();
};
