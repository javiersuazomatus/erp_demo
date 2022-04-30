import { paramCase } from 'change-case';
import { useState } from 'react';
import NextLink from 'next/link';
import { IconButton, MenuItem } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import Iconify from '../../../../components/Iconify';
import MenuPopover from '../../../../components/MenuPopover';
import { UserState } from '../../../../@types/organization';


type Props = {
  onDelete: VoidFunction;
  onActivate: VoidFunction;
  userId: string;
  userState: UserState
};

export default function UserMoreMenu({ onDelete, onActivate, userId, userState }: Props) {
  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow='right-top'
        sx={{
          mt: -1,
          width: 160,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        {userState == UserState.Active && <MenuItem
          onClick={onDelete}
          sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
          Delete
        </MenuItem>}

        {userState == UserState.Deleted && <MenuItem
          onClick={onActivate}
          sx={{ color: 'success.main' }}>
          <Iconify icon={'eva:checkmark-circle-2-outline'} sx={{ ...ICON }} />
          Activate
        </MenuItem>}

        <NextLink href={`${PATH_DASHBOARD.user.root}/${paramCase(userId)}/edit`}>
          <MenuItem>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2, width: 24, height: 24 }} />
            Edit
          </MenuItem>
        </NextLink>
      </MenuPopover>
    </>
  );
}
