import {
  HiOutlineColorSwatch,
  HiOutlineDesktopComputer,
  HiOutlineTemplate,
  HiOutlineViewGridAdd,
  HiOutlineHome,
} from "react-icons/hi";
import { FiUserCheck } from "react-icons/fi";
import { FiBarChart2 } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { FiRefreshCw } from "react-icons/fi";



export type NavigationIcons = Record<string, JSX.Element>;

const navigationIcon: NavigationIcons = {
  home: <HiOutlineHome />,
  assessment: <FiUserCheck />,
  scores: <FiBarChart2 />,
  team: <FiUsers />,
  settings: <FiSettings />,
  rounds: <FiRefreshCw />,
//   singleMenu: <HiOutlineViewGridAdd />,
//   collapseMenu: <HiOutlineTemplate />,
//   groupSingleMenu: <HiOutlineDesktopComputer />,
//   groupCollapseMenu: <HiOutlineColorSwatch />,
};

export default navigationIcon;
