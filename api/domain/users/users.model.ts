import mongoose from "mongoose";
import { env } from "../../common/env";
import { validateCPF } from "../../common/validators";
import { createCipher, createDecipher } from "../../common/crypto-cipher";

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

const hashPassword = (obj: any) => {
	obj.password = createCipher(obj.password, env.db.crypto);
};

const saveMiddleware = function(next: any) {
	const user: User = this;

	if (user.isModified('password')) {
		hashPassword(user);
	}

	next();
};

const updateMiddleware = function(next:any) {
	if (this.getUpdate().$set.password) {
		hashPassword(this.getUpdate().$set);
	}
	console.log(this.getUpdate().$set);

	next();
};

userSchema.pre('save', saveMiddleware);

userSchema.pre('findOneAndUpdate', updateMiddleware);
userSchema.pre('updateOne', updateMiddleware);

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
	},
	{
        "name": "Diana",
        "email": "dia2@dc.com",
        "password": "bruce",
        "gender": "Male",
        "cpf": "892.042.680-50"
    }
]
*/
