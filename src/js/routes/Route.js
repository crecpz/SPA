//引入Component
import { Home } from '../pages/Home.js';
import { Top } from '../pages/Top.js';
import { CustomList } from '../pages/CustomList.js';
import { DefaultList } from '../pages/DefaultList.js';
import { Search } from '../pages/Search.js';

export const Route = [
  { path: '/', component: Home },
  { path: '/defaultlist', component: DefaultList },
  { path: '/top', component: Top },
  { path: '/customlist/:id([A-z0-9]*)?', component: CustomList },
  { path: '/search', component: Search },
];