const dashboard_influencer={
    template:
    `  
    <div>
        <h2>
            Welcome this is Influencer dashboard
        </h2>
        <router-link to="/set_inf_profile">Set Profile</router-link>
        <button type="button" @click="searchCampains">Search Campaigns</button>
        <router-view></router-view> 
        <div>
           <h3>Ad requests</h3>
            <div  v-for="ad in ad_requests_list" :key="ad.id" class="card shadow p-4 border rounded-3 ">
            
                    <div><strong>Influencer:</strong> {{ ad.influencer_id }}</div>
                    <div><strong>Description:</strong> {{ ad.description }}</div>
                    <div><strong>Requirement:</strong> {{ ad.requirement }}</div>
                    <div><strong>Status:</strong> {{ ad.status }}</div>
                    <button v-if="ad.status === 'Pending' || ad.status === 'Edited'" type="button" @click="acceptAd(ad.id)">Accept Ad Request</button>
                    <button v-if="ad.status === 'Pending' || ad.status === 'Edited'" type="button" @click="negotiateAd(ad.id)">Negotiate</button>
        
            </div>
        </div>
        <div v-if=searchMode>
            <h3>Campaigns</h3>
            <div  v-for="campaign in campaign_list" :key="campaign.id" class="card shadow p-4 border rounded-3 ">
            
                    <div><strong>Campaign Name:</strong> {{ campaign.name }}</div>
                    <div><strong>Description:</strong> {{ campaign.description }}</div>
                    <div><strong>Start Date:</strong> {{ campaign.start_date }}</div>
                    <div><strong>End Date:</strong> {{ campaign.end_date }}</div>
                    <div><strong>Goals:</strong> {{ campaign.goals }}</div>
                    <div><strong>Budget:</strong> {{ campaign.budget }}</div>
                    
            </div>
        </div>
            
        
    </div>
    `,
    data(){
        return{
            ad_requests_list:[],
            campaign_list:[],
            searchMode:false,
            
        }
    },
    methods:{
        async acceptAd(id){
            const url = new URL(`${window.location.origin}/accept_ad`);
            url.searchParams.append("id", id);
            const res=await fetch(url,{
              method:"GET",
              headers:{
                AuthenticationToken:sessionStorage.getItem('token'),
      
              },
              
            });
            if (res.ok){
              alert('Ad accepted')
              this.fetchAdRequests();
              
            }
            else{
              console.error("error occured");
            }            
            
        },
        async fetchAdRequests(){
            const email=sessionStorage.getItem('email')
            const res=await fetch(`${window.location.origin}/influencer_adRequest?email=${encodeURIComponent(email)}`,{
                method:'GET',
                headers:{
                    AuthenticationToken: sessionStorage.getItem("token"),
                }
            });
            if(res.ok){
                this.ad_requests_list=await res.json();
            }else{
                alert('Something went wrong')
            }

        },
        async searchCampains(){
            this.searchMode=true
            const email=sessionStorage.getItem('email')
            const res=await fetch(`${window.location.origin}/search_campaign?email=${encodeURIComponent(email)}`,{
                method:'GET',
                headers:{
                    AuthenticationToken: sessionStorage.getItem("token"),
                }
            });
            if(res.ok){
                this.campaign_list=await res.json();
            }else{
                alert('Something went wrong')
            }

        },
        

    },
    mounted() {
        console.log('influencer dashboard mounted')

        this.fetchAdRequests();
    },
}
export default dashboard_influencer;