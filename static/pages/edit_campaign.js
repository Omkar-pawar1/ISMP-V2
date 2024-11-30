// const edit_campaign={
//     template:`
//     <div class="modal">
//         <div class="modal-content">
//         <h3>Edit Campaign</h3>
//         <form @submit.prevent="editCampaign">
//             <div class="mb-3">
//             <label for="campaign-name" class="form-label">Campaign Name</label>
//             <input type="text" class="form-control" id="campaign-name" required />
//             </div>
//             <button type="submit" class="btn btn-primary">Save</button>
//             <button type="button" class="btn btn-secondary" @click="closeForms">Cancel</button>
//         </form>
//         </div>
//   </div>
    
//     `,
//     data(){
//         return{
//             currentCampaign: null,
//             adRequestDetails: '',

//         }
//     },
//     methods:{
//         async editCampaign() {
//             const res = await fetch(`${window.location.origin}/edit_campaign/${this.currentCampaign.id}`, {
//               method: 'PUT',
//               headers: {
//                 AuthenticationToken: sessionStorage.getItem("token"),
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify(this.currentCampaign),
//             });
//             if (res.ok) {
//               alert("Campaign updated successfully!");
//               this.closeForms();
//               this.fetchCampaigns();
//             }
//           },
//         closeForms() {
//             this.currentCampaign = null;
//             this.adRequestDetails = '';
//           },
//         async fetchCampaigns() {
//             const email = sessionStorage.getItem("email");
//             const res = await fetch(`${window.location.origin}/my_campaigns?email=${encodeURIComponent(email)}`, {
//               headers: {
//                 AuthenticationToken: sessionStorage.getItem("token"),
//                 "Content-Type": "application/json",
//               },
//             });
//             if (res.ok) {
//               this.campaigns = await res.json();
//             }
//           },
     
//     },
//     async mounted() {
//         console.log("edit campaign mounted")
//         //this.fetchCampaigns();
//     },
// }


const edit_campaign={
    template:`
    <div class="container">
        <h1 > 
            edit campaing form for campaign {{ currentCampaign_id }}
        </h1>
        <div class="form-container">
         <form @submit.prevent="editCampaign">
                  <div class="mb-3">
                      <label for="name" class="form-label">Campaign Name</label>
                      <input type="text" class="form-control" id="name" name="name" v-model="name" required>
                  </div>
                  <div class="mb-3">
                      <label for="description" class="form-label">Description</label>
                      <input type="text" class="form-control" id="description" name="description" v-model="description" required>
                  </div>
                  <div class="mb-3">
                      <label for="start_date" class="form-label">Start Date</label>
                      <input type="date" class="form-control" id="start_date" name="start_date" v-model="startDate" required>
                  </div>
                  <div class="mb-3">
                      <label for="end_date" class="form-label">End Date</label>
                      <input type="date" class="form-control" id="end_date" name="end_date" v-model="endDate" required>
                  </div>
                  <div class="mb-3">
                      <label for="budget" class="form-label">Budget</label>
                      <input type="number" class="form-control" id="budget" name="budget" v-model="budget" required>
                  </div>
                  <div class="mb-3">
                      <label for="visibility" class="form-label">Select who can see this campaign</label>
                      <select class="form-select" id="visibility"  name="visibility" v-model="visibility" required>
                          <option value="">Select here</option>
                          <option value="Public">Public</option>
                          <option value="Private">Private</option>
                      </select>
                  </div>
                  <div class="mb-3">
                      <label for="category" class="form-label">Select category for campaign</label>
                      <select class="form-select" id="category" name="category" v-model="category" required>
                          <option value="">Select here</option>
                          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                      </select>
                  </div>
                  <div class="mb-3">
                      <label for="goals" class="form-label">Goals for Campaign</label>
                      <input type="text" class="form-control" id="goals" name="goal" v-model="goals" required>
                  </div>
                  <button type="submit" class="btn btn-primary">Save</button>
                  <button type="button" class="btn btn-secondary" @click="closeForms">Cancel</button>
              </form>
         </div>
        
  </div>
    `,
    data(){
        return{
            categories: [
                "Fashion",
                "Beauty",
                "Lifestyle",
                "Fitness and Health",
                "Travel",
                "Food and Beverage",
                "Technology",
                "Finance",
                "Education",
                "Entertainment",
                "Automotive",
                "Pets",
              ],
      
                name: "",
                description: "",
                startDate: "",
                endDate: "",
                budget: "",
                visibility: "",
                category: "",
                goals: "",
                currentCampaign_id:null,
                adRequestDetails: '',

        }

    },
    created() {

        this.currentCampaign_id = this.$route.params.id;
        console.log("in created and setting id",this.currentCampaign_id);
    },
      
    methods:{
        async editCampaign() {
            const res = await fetch(`${window.location.origin}/edit_campaign/${this.currentCampaign_id}`, {
              method: 'PUT',
              headers: {
                AuthenticationToken: sessionStorage.getItem("token"),
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email:sessionStorage.getItem("email"),
                name:this.name,
                description:this.description,
                start_date:this.startDate,
                end_date:this.endDate,
                budget:this.budget,
                visibility:this.visibility,
                category:this.category,
                goal:this.goals,
              }),
            });
            if (res.ok) {
              alert("Campaign updated successfully!");
              this.closeForms();
              this.$router.push('/sponsor_dashboard')
            }
          },
        closeForms() {
            this.currentCampaign_id = null;
            this.adRequestDetails = '';
          },

    },
    async mounted() {
        console.log("edit campaign mounted")
        //this.fetchCampaigns();
    },
}
export default edit_campaign;


