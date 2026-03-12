import z from 'zod';

const schema = z.object({
  email: z.email({ pattern: z.regexes.html5Email, error: 'Please enter a valid email' }),
});

export type MagicLinkSignInSchema = z.infer<typeof schema>;
export default schema;
