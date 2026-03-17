import * as React from 'react';
import { Profile } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils';

export const UserBadge = ({ avatar_url, full_name, email }: Partial<Profile>) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar size="sm">
        {avatar_url && <AvatarImage src={avatar_url} />}
        <AvatarFallback>{getInitials(full_name)}</AvatarFallback>
      </Avatar>
      <span>{full_name ?? email}</span>
    </div>
  );
};
