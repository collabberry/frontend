import {
  NAV_ITEM_TYPE_TITLE,
  NAV_ITEM_TYPE_ITEM,
  NAV_ITEM_TYPE_COLLAPSE,
} from "@/constants/navigation.constant";
import type { NavigationTree } from "@/@types/navigation";
import { FiUserCheck } from "react-icons/fi";

const navigationConfig: NavigationTree[] = [
  {
    key: "admin",
    path: "",
    title: "Admin",
    translateKey: "nav.admin.admin",
    icon: "",
    type: NAV_ITEM_TYPE_TITLE,
    authority: [],
    subMenu: [
      {
        key: "admin.dashboard",
        path: "/dashboard",
        title: "Dashboard",
        translateKey: "nav.admin.dashboard",
        icon: "home",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
      },
      {
        key: "admin.assessment",
        path: "/assessment",
        title: "Assessment",
        translateKey: "nav.admin.assessment",
        icon: "assessment",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
      },
      /** Example purpose only, please remove */
      {
        key: "admin.scores",
        path: "/scores",
        title: "My Scores",
        translateKey: "nav.admin.scores",
        icon: "scores",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
      },
    ],
  },

  // {
  //     key: 'collapseMenu',
  //     path: '',
  //     title: 'Collapse Menu',
  //     translateKey: 'nav.collapseMenu.collapseMenu',
  //     icon: 'collapseMenu',
  //     type: NAV_ITEM_TYPE_COLLAPSE,
  //     authority: [],
  //     subMenu: [
  //         {
  //             key: 'collapseMenu.item1',
  //             path: '/collapse-menu-item-view-1',
  //             title: 'Collapse menu item 1',
  //             translateKey: 'nav.collapseMenu.item1',
  //             icon: '',
  //             type: NAV_ITEM_TYPE_ITEM,
  //             authority: [],
  //             subMenu: [],
  //         },
  //         {
  //             key: 'collapseMenu.item2',
  //             path: '/collapse-menu-item-view-2',
  //             title: 'Collapse menu item 2',
  //             translateKey: 'nav.collapseMenu.item2',
  //             icon: '',
  //             type: NAV_ITEM_TYPE_ITEM,
  //             authority: [],
  //             subMenu: [],
  //         },
  //     ],
  // },
  {
    key: "org",
    path: "",
    title: "Organization",
    translateKey: "nav.org.org",
    icon: "",
    type: NAV_ITEM_TYPE_TITLE,
    authority: [],
    subMenu: [
      {
        key: "org.team",
        path: "/team",
        title: "Team",
        translateKey: "nav.org.team",
        icon: "team",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
      },
      {
        key: "org.settings",
        path: "/settings",
        title: "Settings",
        translateKey: "nav.org.settings",
        icon: "settings",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
      },
      {
        key: "org.rounds",
        path: "/rounds",
        title: "Rounds",
        translateKey: "nav.org.rounds",
        icon: "rounds",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
      },
    ],
  },
];

export default navigationConfig;
