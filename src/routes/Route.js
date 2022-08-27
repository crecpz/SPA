//引入Component
import { Home } from '../pages/Home.js';
import { Top } from '../pages/Top.js';
import { NotFound } from '../pages/NotFound.js';

export const Route = [
  // { path: '/', component: NotFound},
  { path: '/', component: Home },
  { path: '/top', component: Top }
];