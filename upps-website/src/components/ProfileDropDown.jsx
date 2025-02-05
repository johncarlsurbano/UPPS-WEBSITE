import * as React from 'react';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import userProfileImage from "../assets/tutin.png";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user";
import Swal from 'sweetalert2'



function ProfileDropDown() {
  const user = useSelector((state) => state.user.value.user);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const navigate  = useNavigate();
  const dispatch = useDispatch();

  const handleToggle = () => {
    
    setOpen((prevOpen) => !prevOpen);
  
    
  };    

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleViewProfile = () => {
    if(user.role === "Personnel" || user.role === "Chairman" ){
      navigate('/personnel/profile/'); // Navigate to the dashboard
    }
    else {
      navigate('/officehead/profilepage/')
    }
    setOpen(false); // Close the dropdown
  };


  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/landingpage')
    Swal.fire({
      title: "Success!",
      text: "Logout Successfully!",
      icon: "success"
    });
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Stack direction="row" spacing={2}>
      <div>
      <img
          ref={anchorRef}
          src={userProfileImage}
          alt="User Profile"
          className="rounded-full border-[#17163A] border-[2px] cursor-pointer"
          onClick={handleToggle}
          
        />
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-end' ? 'left top' : 'left bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={handleViewProfile}>View Profile</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    {user.role === "Chairman" ? (
                      <MenuItem onClick={() => navigate('/chairman/dashboard2/')}>
                        My Dashboard
                      </MenuItem>
                    ) :
                     (null)
                    }
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
}

export default ProfileDropDown