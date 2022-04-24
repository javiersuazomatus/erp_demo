// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar, { Props as AvatarProps } from './Avatar';
// redux
import { useSelector } from '../redux/store';
import { Organization } from '../@types/organization';

// ----------------------------------------------------------------------

export default function OrganizationAvatar({ ...other }: AvatarProps) {
  const { currentOrganization }: { currentOrganization: Organization } =
    useSelector((state) => state.organization);
  const avatar = createAvatar(currentOrganization.name);
  return (
    <Avatar
      src={`${currentOrganization?.logoURL}`}
      alt={currentOrganization.name}
      color={currentOrganization?.logoURL ? 'default' : avatar.color}
      {...other}
    >
      {avatar.name}
    </Avatar>
  );
}
