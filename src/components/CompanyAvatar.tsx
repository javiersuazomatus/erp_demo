// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar, { Props as AvatarProps } from './Avatar';
// redux
import { useSelector } from '../redux/store';

// ----------------------------------------------------------------------

export default function CompanyAvatar({ ...other }: AvatarProps) {
  const { company } = useSelector((state) => state.company);
  const avatar = createAvatar(company?.name);
  return (
    <Avatar
      src={`${company?.photoURL}`}
      alt={company?.name}
      color={company?.photoURL ? 'default' : avatar.color}
      {...other}
    >
      {avatar.name}
    </Avatar>
  );
}
