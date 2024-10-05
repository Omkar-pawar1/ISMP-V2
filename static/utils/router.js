import admin_dashboard2 from "../pages/admin_dashboard2.js";
import login from "../pages/login.js"
import Logout from "../pages/logout.js";
import register from "../pages/register.js"


const routes = [
    { path: '/login', component: login},
    { path: '/register', component: register },
    {path:'/admin_dashboard2',component:admin_dashboard2 },
    {path:'/logout',component:Logout},
  ]
  
const router = new VueRouter({
    routes,
  });

export default router;