import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Profile } from '@/types';
import { ControllerFieldState } from 'react-hook-form';
import { UserBadge } from '@/components/ui/user-badge';

interface AssigneeField {
  name: string;
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  onBlur?: () => void;
}

interface Props {
  options: Array<Profile>;
  field: AssigneeField;
  fieldState?: ControllerFieldState;
}

export const AssigneeSelect = ({ options, field, fieldState }: Props) => {
  return (
    <Select
      value={field.value ?? '__unassigned__'}
      onValueChange={(v) => field.onChange(v === '__unassigned__' ? null : v)}
      onOpenChange={(open) => !open && field.onBlur?.()}
    >
      <SelectTrigger id={field.name} className="w-full" aria-invalid={fieldState?.invalid}>
        <SelectValue placeholder="Unassigned" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__unassigned__">Unassigned</SelectItem>
        {options.map((profile) => (
          <SelectItem key={profile.id} value={profile.id}>
            <UserBadge {...profile} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
