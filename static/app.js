import Navbar from "./components/navbar.js"
import router from "./utils/router.js"
new Vue({
    el: '#app',
    template:
    `
    <div>
       <Navbar>
       </Navbar>
    
       <router-view></router-view> 
       </div>
    `,
    components: {
        'Navbar': Navbar 
         },
    router,

})