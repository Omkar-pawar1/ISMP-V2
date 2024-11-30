import admin_dashboard2 from "../pages/admin_dashboard2.js";
import login from "../pages/login.js"
import Logout from "../pages/logout.js";
import register from "../pages/register.js"
import sponsor_dashboard from "../pages/dashboard_sponsor.js";
import influencer_dashboard from "../pages/dashboard_influencer.js";
import Campaign_creation_form from "../pages/campaign_creation_form.js";
import my_campaigns from "../pages/my_campains.js";
import edit_campaign from "../pages/edit_campaign.js";
import ad_request_form from "../pages/ad_request_form.js";
import infProfile from "../pages/setinfluecerPro.js";
import edit_adRequest from "../pages/edit_adRequest.js";



const routes = [
    { path: '/login', component: login},
    { path: '/register', component: register },
    {path:'/admin_dashboard2',component:admin_dashboard2 },
    {path:'/logout',component:Logout},
    {path:'/sponsor_dashboard',component:sponsor_dashboard},
    {path:'/influencer_dashboard',component:influencer_dashboard},
    { path: '/create_campaign', component: Campaign_creation_form},
    {path:'/my_campaigns',component:my_campaigns},
    {path:'/edit_campaign/:id',component:edit_campaign},
    {path:'/ad_request_form/:id',component:ad_request_form},
    {path:'/set_inf_profile',component:infProfile},
    {path:'/edit_adRequest/:id',component:edit_adRequest}
  ]
  
const router = new VueRouter({
    routes,
  });

export default router;