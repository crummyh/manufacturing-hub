import { nanoid } from 'nanoid';
import z from 'zod';

export const ID_LENGTH = 21;

// A basic nanoid for db keys
export function defaultNanoid() {
	return nanoid(ID_LENGTH);
}

// A generator for nanoids
export const genDefaultNanoid = () => defaultNanoid();
