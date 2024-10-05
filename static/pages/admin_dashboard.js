const admin_dashboard={
    template:
    `
    <div>
     Admin Dashboard
      <button class="btn btn-secondary" @click="activate_spon"> See UNActivate </button>
    <div v-for="sponsor in inactive_sponsors">
         <div class="justify"> <span> email : {{sponsor.email}} </span> <span> <button class="btn btn-secondary" @click="activate(sponsor.id)"> Activate </button> </span> </div>

    </div>
    </div>
    `,
    data(){
        return{
            inactive_sponsors:[],
        };
    },
    methods: {
        async activate_spon(){
            console.log("In admin_dashboard.js and this is tokenn",sessionStorage.getItem("token"));
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', sessionStorage.getItem("token"));

        const res=await fetch(window.location.origin+"/new_sponsors",{
            // headers:{

            //     Authorization: sessionStorage.getItem("token"),
            
            //    },
            method: 'GET',
            headers: myHeaders,
        })
        if(res.ok){
            
            const data=await res.json();
            this.inactive_sponsors=data;
            console.log("inactive sponsors",this.inactive_sponsors)
        
        }else {
            console.error("Failed to fetch sponsors:", res.status);
        }

        }
    },
    // async mounted() {
    //     console.log("In admin_dashboard.js and this is tokenn",sessionStorage.getItem("token"));
    //     const myHeaders = new Headers();
    //     myHeaders.append('Content-Type', 'application/json');
    //     myHeaders.append('Authorization', sessionStorage.getItem("token"));

    //     const res=await fetch(window.location.origin+"/new_sponsors",{
    //         // headers:{

    //         //     Authorization: sessionStorage.getItem("token"),
            
    //         //    },
    //         method: 'GET',
    //         headers: myHeaders,
    //     })
    //     if(res.ok){
            
    //         const data=await res.json();
    //         this.inactive_sponsors=data;
    //         console.log("inactive sponsors",this.inactive_sponsors)
        
    //     }else {
    //         console.error("Failed to fetch sponsors:", res.status);
    //     }
    // },
}
export default admin_dashboard;