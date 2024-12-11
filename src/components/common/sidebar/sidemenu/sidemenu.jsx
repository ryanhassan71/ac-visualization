

export const MENUITEMS = [
  {
    menutitle: 'OUTLETS',
  },
  {
    icon: (<i className="side-menu__icon bx bx-home"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    dirchange: false,
    title: 'Hosna Center',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}10/2/main`, type: 'link', active: false, selected: false, dirchange: false, title: 'Main' },

      { path: `${import.meta.env.BASE_URL}10/2/power`, type: 'link', active: false, selected: false, dirchange: false, title: 'Power' },
    ]
  },

  {
    icon: (<i className="side-menu__icon bx bx-home"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    dirchange: false,
    title: 'DMA Gulshan Office',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}4/1/main`, type: 'link', active: false, selected: false, dirchange: false, title: 'Main' },

      { path: `${import.meta.env.BASE_URL}4/1/power`, type: 'link', active: false, selected: false, dirchange: false, title: 'Power' },
    ]
  },


];




