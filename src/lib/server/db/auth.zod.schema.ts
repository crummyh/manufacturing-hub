import { createSelectSchema } from 'drizzle-zod';
import { email } from 'zod';

import { user } from './auth.schema';

export const userSelectSchema = createSelectSchema(user, {
	email: email()
});
