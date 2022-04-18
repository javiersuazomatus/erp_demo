// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar, { Props as AvatarProps } from './Avatar';
// redux
import { useSelector } from '../redux/store';

// ----------------------------------------------------------------------

export default function OrganizationAvatar({ ...other }: AvatarProps) {
  const { organization } = useSelector((state) => state.organization);
  const avatar = createAvatar(organization?.name);
  return (
    <Avatar
      src={`${organization?.logoURL}`}
      alt={organization?.name}
      color={organization?.logoURL ? 'default' : avatar.color}
      {...other}
    >
      {avatar.name}
    </Avatar>
  );
}
