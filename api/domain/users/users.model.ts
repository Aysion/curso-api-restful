import mongoose from "mongoose";
import { validateCPF } from "../../common/validators";

export interface User extends mongoose.Document {
	name: string,
	email: string,
	password: string,
}

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		maxlength: 80,
		minlength: 3,
	},
	email: {
		type: String,
		unique: true,
		required: true,
		match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	},
	password: {
		type: String,
		select: false,
		required: true,
	},
	gender: {
		type: String,
		required: false,
		enum: ["Male", "Female"],
	},
	cpf: {
		type: String,
		required: false,
		validate: {
			validator: validateCPF,
			message: "Path `{PATH}` is Invalid ({VALUE}).",
		}
	}
});

export const User = mongoose.model<User>('User', userSchema);

/**
[
	{
		"_id": "5bad07778841915d22caed89",
		"name": "Peter",
		"email": "peter@mavel.com",
		"password": "tia-may"
	},
	{
		"_id": "5bad07ce8841915d22caeda1",
		"name": "Bruce Wayne",
		"email": "bruce@mavel.com",
		"password": "batman"
	}
]
*/
