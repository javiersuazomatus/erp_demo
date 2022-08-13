import { useState } from 'react';
import NextLink from 'next/link';
import { CircularProgress, IconButton, MenuItem } from '@mui/material';
import { PATH_ORGANIZATION } from '../../../../routes/paths';
import Iconify from '../../../../components/Iconify';
import MenuPopover from '../../../../components/MenuPopover';
import { UserState } from '../../../../@types/organization';
import { useSelector } from '../../../../redux/store';


type Props = {
  onDelete: VoidFunction;
  onBlock: VoidFunction;
  onActivate: VoidFunction;
  userId: string;
  userState: UserState
};

export default function UserMoreMenu({ onActivate, onBlock, onDelete, userId, userState }: Props) {
  const { currentOrganization } = useSelector((state) => state.organization);

  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [isActivating, setIsActivating] = useState<boolean | null>(null);
  const [isBlocking, setIsBlocking] = useState<boolean | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean | null>(null);

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

  const PROGRESS = {
    mr: 2,
    color: 'inherit'
  }

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
        <NextLink href={PATH_ORGANIZATION.detail.users.edit(currentOrganization.id, userId)}>
          <MenuItem>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2, width: 24, height: 24 }} />
            Edit
          </MenuItem>
        </NextLink>

        { [UserState.Deleted, UserState.Blocked].includes(userState) && <MenuItem
          onClick={async () => {
            setIsActivating(true);
            await onActivate();
            setIsActivating(false);
          }}
          sx={{ color: 'success.main' }}>
          {isActivating
            ? <CircularProgress size='1rem' sx={{ ...PROGRESS}} />
            : <Iconify icon={'eva:checkmark-circle-2-outline'} sx={{ ...ICON }} />
          }
          Activate
        </MenuItem>}

        {userState == UserState.Active && <MenuItem
          onClick={async () => {
            setIsBlocking(true);
            await onBlock();
            setIsBlocking(false);
          }}>
          {isBlocking
            ? <CircularProgress size='1rem' sx={{ ...PROGRESS}} />
            : <Iconify icon={'eva:close-circle-outline'} sx={{ ...ICON }} />
          }
          Block
        </MenuItem>}


        {userState == UserState.Active && <MenuItem
          onClick={async () => {
            setIsDeleting(true);
            await onDelete();
            setIsDeleting(false);
          }}
          sx={{ color: 'error.main' }}>
          {isDeleting
            ? <CircularProgress size='1rem' sx={{ ...PROGRESS}} />
            : <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
          }
          Delete
        </MenuItem>}
      </MenuPopover>
    </>
  );
}
