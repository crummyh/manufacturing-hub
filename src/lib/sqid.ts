import Sqids from 'sqids';
import { z } from 'zod';

const sqids = new Sqids();

export const toSqid = (id: number) => sqids.encode([id]);
export const fromSqid = (sqid: string): number => {
	const [id] = sqids.decode(sqid);
	if (id === undefined) throw new Error(`Invalid sqid: ${sqid}`);
	return id;
};

// Reusable transform schemas, in each direction
//
// DB -> API (number -> string)
export const sqidOutput = z.number().transform((val, ctx) => {
	try {
		return toSqid(val);
	} catch {
		ctx.issues.push({
			code: 'custom',
			message: 'not a valid id',
			input: val
		});
	}
});

// API -> DB (string -> number)
export const sqidInput = z.string().transform((val, ctx) => {
	try {
		return fromSqid(val);
	} catch {
		ctx.issues.push({
			code: 'custom',
			message: 'not a valid id',
			input: val
		});
	}
});
