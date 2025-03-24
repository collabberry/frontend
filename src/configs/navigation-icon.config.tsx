import {
  HiOutlineColorSwatch,
  HiOutlineDesktopComputer,
  HiOutlineTemplate,
  HiOutlineViewGridAdd,
  HiOutlineHome,
} from "react-icons/hi";
import { FiPieChart, FiUserCheck } from "react-icons/fi";
import { FiBarChart2 } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { FiRefreshCw } from "react-icons/fi";
import ManualAllocation from "@/views/main/Team/ManualAllocation";
import { RiMoneyDollarCircleLine } from "react-icons/ri";



export type NavigationIcons = Record<string, JSX.Element>;

const navigationIcon: NavigationIcons = {
  home: <HiOutlineHome />,
  assessment: <FiUserCheck />,
  scores: <FiBarChart2 />,
  team: <FiUsers />,
  settings: <FiSettings />,
  rounds: <FiRefreshCw />,
  adminManagement: <FiUserCheck />,
  manualAllocation: <FiPieChart />,
  materialContribution: <RiMoneyDollarCircleLine />,
//   singleMenu: <HiOutlineViewGridAdd />,
//   collapseMenu: <HiOutlineTemplate />,
//   groupSingleMenu: <HiOutlineDesktopComputer />,
//   groupCollapseMenu: <HiOutlineColorSwatch />,
};

export default navigationIcon;
