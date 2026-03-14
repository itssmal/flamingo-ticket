import { Profile, Comment } from '@/types';

export type CommentWithAuthor = Comment & {
  author: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'email'>;
};
