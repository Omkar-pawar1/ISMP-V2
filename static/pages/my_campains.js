export default {
  template: `
    <div>
      <h2>MY CAMPAIGNS</h2>
      <div v-for="campaign in campaigns" :key="campaign.id" class="campaign-card">
        <div class="d-flex justify-content-between align-items-center p-3 border rounded mb-2">
          <span><strong>Name:</strong> {{ campaign.name }}</span>
          <button v-if=!isviewMode class="btn btn-secondary" @click="viewDetails(campaign)">View Details</button>
          <button class="btn btn-secondary" @click="Edit_Campaign(campaign)">Edit Campaign</button>
          <button class="btn btn-danger" @click="deleteCampaign(campaign.id)">Delete Campaign</button>
          <button class="btn btn-primary" @click="AdRequestForm(campaign)">Make AD Request</button>
        </div>
        <div  v-if=isviewMode class="d-flex justify-content-center align-items-center ">
          <div class="card shadow p-4 border rounded-3 ">
        
            <div><strong>Description:</strong> {{ campaign.description }}</div>
            <div><strong>Start Date:</strong> {{ campaign.start_date }}</div>
            <div><strong>End Date:</strong> {{ campaign.end_date }}</div>
            
          </div>
          <div  v-for="ad in campaign.ad_requests" :key="ad.id" class="card shadow p-4 border rounded-3 ">
        
          <div><strong>Influencer:</strong> {{ ad.influencer_id }}</div>
            <div><strong>Description:</strong> {{ ad.description }}</div>
            <div><strong>Requirement:</strong> {{ ad.requirement }}</div>
            <button class="btn btn-secondary" @click="Edit_Ad(ad.id)">Edit Ad Request</button>
            <button class="btn btn-danger" @click="deleteAd(ad.id)">Delete Ad Request</button>
          
            
          </div>
          <button v-if=isviewMode class="btn btn-secondary" @click="hideDetails">Hide Details</button>
        </div>
      </div>

    </div>



  `,
  data() {
    return {
      campaigns: [],
      isviewMode: false,
      currentCampaign: null,
      
    };
  },
  methods: {
    viewDetails() {
      this.isviewMode=true;
      
    },
    hideDetails(){
      this.isviewMode=false;
    },

    Edit_Campaign(campaign) {
      this.$router.push(`/edit_campaign/${campaign.id}`)
      
    },
    AdRequestForm(campaign) {
      this.$router.push(`/ad_request_form/${campaign.id}`)
      
    },
    Edit_Ad(ad_id){
      this.$router.push(`/edit_adRequest/${ad_id}`)

    },
    async deleteAd(ad_id){
      const res=await fetch(`${window.location.origin}/delete_ad/${ad_id}`,{
        method:'DELETE',
        headers:{
          AuthenticationToken:sessionStorage.getItem('token'),
        },

      });
      if (res.ok){
        alert("Ad Request deleted successfully");
        this.fetchCampaigns();
      }else{
        console.error("failed")
        
      }

    },
    
    async deleteCampaign(id) {
      const confirmed = confirm("Are you sure you want to delete this campaign?");
      if (confirmed) {
        const res = await fetch(`${window.location.origin}/delete_campaign/${id}`, {
          method: 'DELETE',
          headers: {
            AuthenticationToken: sessionStorage.getItem("token"),
          },
        });
        if (res.ok) {
          alert("Campaign deleted successfully!");
          this.fetchCampaigns();
        }
      }
    },
    
    async fetchCampaigns() {
      const email = sessionStorage.getItem("email");
      const res = await fetch(`${window.location.origin}/my_campaigns?email=${encodeURIComponent(email)}`, {
        headers: {
          AuthenticationToken: sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        this.campaigns = await res.json();
      }
    },
  },
  async mounted() {
    this.fetchCampaigns();
  },
};



// const my_campaigns = {
//     template: `
//      <div>
//     <h2>MY CAMPAIGNS</h2>
//     <div v-for="campaign in campaigns" :key="campaign.id" class="campaign-card">
//       <div class="d-flex justify-content-between align-items-center p-3 border rounded mb-2">
//         <span><strong>Name:</strong> {{ campaign.name }}</span>
//         <button class="btn btn-secondary">View detais</button>
//         <button class="btn btn-secondary">Edil Campaign</button>
//         <button class="btn btn-secondary">Delete Campaign</button>
//         <button class="btn btn-secondary">Make AD Request</button>
//       </div>
//     </div>
//   </div>
//     `,
//     data() {
//       return {
//         campaigns: [],
        
//       };
//     },
//     methods: { 
//       async ad_request(){
        

//       },
      
//     },
//     async mounted() {
//         const email = sessionStorage.getItem("email");
//         const res = await fetch(`${window.location.origin}/my_campaigns?email=${encodeURIComponent(email)}`, {
//             headers: {
//                 AuthenticationToken: sessionStorage.getItem("token"),
//                 "Content-Type": "application/json",
//             },
//         });
    
//         if (res.ok) {
//             this.campaigns = await res.json();
//             console.log("my campaigns",this.campaigns)
//         }
//     }
    
    
    
//   };
  
//   export default my_campaigns; 
  