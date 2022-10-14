//引入Component
import { Home } from '../pages/Home.js';
import { Top } from '../pages/Top.js';
import { CustomList } from '../pages/CustomList.js';
import { All } from '../pages/All.js';
import { DefaultList } from '../pages/DefaultList.js';
import { NotFound } from '../pages/NotFound.js';

export const Route = [
  // { path: '/', component: NotFound},
  { path: '/', component: Home },
  { path: '/all', component: All },
  { path: '/defaultlist', component: DefaultList },
  { path: '/top', component: Top },
  { path: '/customlist/:id([A-z0-9]*)?', component: CustomList }
];