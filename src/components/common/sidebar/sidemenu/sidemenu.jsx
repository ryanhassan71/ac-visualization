

export const MENUITEMS = [
  {
    menutitle: 'MAIN',
  },
  {
    icon: (<i className="side-menu__icon bx bx-home"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    dirchange: false,
    title: 'Dashboards',
    badge: '',
    badgetxt: '12',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}dashboards/main`, type: 'link', active: false, selected: false, dirchange: false, title: 'Main' },
    ]
  },
  {
    menutitle: "WEB APPS",
  },
  {
    title: "Nested Menu",
    icon: (
      <i className="bx bx-layer side-menu__icon"></i>
    ),
    type: "sub",
    selected: false,
    dirchange: false,
    active: false,
    children: [
      {
        path: '#',
        title: "Nested-1",
        type: "empty",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        title: "Nested-2",
        type: "sub",
        selected: false,
        dirchange: false,
        active: false,
        children: [
          {
            path: '#',
            title: "Nested-2.1",
            type: "empty",
            active: false,
            selected: false,
            dirchange: false,
          },
          {
            path: '#',
            title: "Nested-2.2",
            type: "empty",
            active: false,
            selected: false,
            dirchange: false,
          },
        ],
      },
    ],
  },
  {
    menutitle: "AC's",
  },
  {
    title: "ACs",
    icon: (
      <i className="bx bx-air-conditioner side-menu__icon"></i>
    ),
    type: "sub",
    selected: false,
    dirchange: false,
    active: false,
    children: Array.from({ length: 13 }, (_, i) => ({
      path: `${import.meta.env.BASE_URL}dashboards/main/ac/${30 + i}`,
      title: `AC-${String.fromCharCode(65 + i)}`,
      type: "link",
      active: false,
      selected: false,
      dirchange: false,
    })),
  },
];


