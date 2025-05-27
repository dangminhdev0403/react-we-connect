"use client";

import {
  HomeOutlined,
  Hub,
  Lock,
  Message,
  People,
  TranslateOutlined,
} from "@mui/icons-material";
import {
  Drawer,
  List,
  ListSubheader,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { settingSlice } from "@redux/slices/settingSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ListStyled = styled(List)`
  padding: 16px;
  border-radius: 4px;
`;

const SideBarConten = () => {
  return (
    <div className="w-64 flex flex-col gap-4">
      <ListStyled>
        <List className="flex flex-col bg-white !py-3 !px-4 shadow gap-4">
          <Link to="/" className="flex items-center gap-2">
            <HomeOutlined fontSize="small" /> New Feeds
          </Link>
          <Link to="messages" className="flex items-center gap-2">
            <Message /> Messager
          </Link>
          <Link to="/friends" className="flex items-center gap-2">
            <People /> Friends
          </Link>
          <Link to="/groups" className="flex items-center gap-2">
            <Hub /> Groups
          </Link>
        </List>
      </ListStyled>
      <ListStyled>
        <List className="flex flex-col bg-white !py-3 !px-4 shadow gap-4">
          <ListSubheader className="!px-0 !leading-none">
            Settings
          </ListSubheader>
          <Link to="/settings/account" className="flex items-center gap-2">
            <Lock /> Acount
          </Link>
          <Link to="/settings/languege" className="flex items-center gap-2">
            <TranslateOutlined /> Languege
          </Link>
        </List>
      </ListStyled>
    </div>
  );
};

const Sidebar = () => {
  const isShowDrawer = useSelector((state) => state.setting.isShowDrawer);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return isMobile ? (
    <Drawer
      open={isShowDrawer}
      onClose={() => {
        dispatch(settingSlice.actions.toggleDrawer());
      }}
    >
      <SideBarConten />
    </Drawer>
  ) : (
    <SideBarConten />
  );
};

export default Sidebar;
