import { user } from './auth.schema';
import { createSelectSchema } from 'drizzle-zod';
import { email } from 'zod';

export const userSelectSchema = createSelectSchema(user, {
	email: email()
});
