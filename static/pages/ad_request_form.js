const ad_request_form = {
  template: `
    <div>
      <h1>Ad Request Form</h1>
      <div class="modal-content">
        <h3>Make AD Request</h3>
        <div class="form-container">
          <form @submit.prevent="makeAdRequest">
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <input type="text" v-model="description" class="form-control" id="description" name="message" required>
              </div>
              <div class="mb-3">
                <label for="requirement" class="form-label">Requirements</label>
                <input type="text" v-model="requirement" class="form-control" id="requirement" name="requirement" required>
              </div>
              <div class="mb-3">
                <label for="payment_amount" class="form-label">Payment</label>
                <input type="number" v-model="payment_amount" class="form-control" id="payment_amount" name="payment_amount" required>
              </div>
              <div class="position-absolute top-0 start-0 w-100 bg-white p-3 z-3" v-if=showinfluencerlist>
                    <div v-for="(influencer, index) in influencer" :key="index">
                      <li @click="selectInfluencer(influencer)">Name: {{ influencer.name }}</li>
                      <li>Reach: {{ influencer.reach }}</li>
                    </div>
                </div>
              <div class="mb-3">
                <h2>Search Influencers</h2>
                <div class="form-group">
                  <label for="category">Select Category:</label>
                  <select v-model="selectedCategory" id="category" class="form-select" @change="updateNiches" required>
                    <option value="">Select Category</option>
                    <option v-for="category in Object.keys(categoriesNiches)" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="niche">Select Niche:</label>
                  <select v-model="selectedNiche" id="niche" class="form-select" required>
                    <option value="">Select Niche</option>
                    <option v-for="niche in niches" :key="niche" :value="niche">
                      {{ niche }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <button type="button" value="Search" class="btn btn-primary w-100" @click="searchInfluencer(selectedCategory,selectedNiche)">Search</button>
                </div>
                
                <label for="influencer" class="form-label">Influencer Name</label>
                <input type="text" v-model="selected_influencer" class="form-control" id="influencer" name="influencer" required>
              </div>
              <button type="submit" class="btn btn-primary">Submit</button>
              <button type="button" class="btn btn-secondary" @click="closeForms">Cancel</button>
          </form>
        </div>
      </div>          
    </div>
  `,
  data() {
    return {
      categoriesNiches: {
        'Fashion': ['Streetwear', 'High Fashion', 'Sustainable Fashion', 'Plus-Size Fashion', "Children's Fashion"],
        'Beauty': ['Skincare', 'Makeup Tutorials', 'Haircare', 'Natural/Organic Beauty', "Men's Grooming"],
        'Lifestyle': ['Minimalism', 'Parenting', 'Home Decor', 'Organization', 'Wellness'],
        'Fitness and Health': ['Yoga', 'CrossFit', 'Bodybuilding', 'Nutrition', 'Mental Health'],
        'Travel': ['Luxury Travel', 'Budget Travel', 'Adventure Travel', 'Solo Travel', 'Family Travel'],
        'Food and Beverage': ['Vegan Cooking', 'Baking', 'Wine Tasting', 'Restaurant Reviews', 'Healthy Recipes'],
        'Technology': ['Gadgets', 'Software Reviews', 'Gaming', 'Coding Tutorials', 'Tech News'],
        'Finance': ['Personal Finance', 'Cryptocurrency', 'Investing', 'Real Estate', 'Frugal Living'],
        'Education': ['Language Learning', 'Science Communication', 'Educational Toys', 'Online Courses', 'Study Tips'],
        'Entertainment': ['Movie Reviews', 'Music', 'Comedy', 'Theatre', 'Celebrity News'],
        'Automotive': ['Car Reviews', 'Motorcycles', 'Electric Vehicles', 'Car Maintenance', 'Automotive News'],
        'Pets': ['Dog Training', 'Cat Care', 'Pet Products', 'Exotic Pets', 'Pet Adoption']
      },
      currentCampaign_id: null,
      influencer: [],
      sponsor: null,
      description: null,
      requirement: null,
      payment_amount: null,
      selectedCategory: '',
      selectedNiche: '',
      niches: [],
      showinfluencerlist:false,
      selected_influencer:''
      
    };
  },
  created() {
    this.currentCampaign_id = this.$route.params.id;
    if (sessionStorage.getItem('role') === 'sponsor') {
      this.sponsor = sessionStorage.getItem('email');
    } else if (sessionStorage.getItem('role') === 'influencer') {
      
    }
    console.log('Created, setting ID:', this.currentCampaign_id);
  },
  methods: {
    selectInfluencer(influencer){
      this.selected_influencer=influencer.name;
      console.log(this.selected_Influencer)
      this.showinfluencerlist=false;
    },
    async searchInfluencer(selectedCategory,selectedNiche){
      
      const url = new URL(`${window.location.origin}/searchInfluencer`);
      url.searchParams.append("category", selectedCategory);
      url.searchParams.append("niche", selectedNiche);
      const res=await fetch(url,{
        method:"GET",
        headers:{
          AuthenticationToken:sessionStorage.getItem('token'),

        },
        
      });
      if (res.ok){
        const data=await res.json()
        if (data.error){
          console.error(data.error);
          alert(data.error);

        }else{
          this.influencer=data;
          this.showinfluencerlist=true;
          console.log(this.influencer[0]['name'])
        }
        
      }
      else{
        console.error("No influencer is present in niche");
      }

    },
    updateNiches() {
      this.niches = this.categoriesNiches[this.selectedCategory] || [];
    },
    async makeAdRequest() {
      try {
        const res = await fetch(`${window.location.origin}/make_ad_request/${this.currentCampaign_id}`, {
          method: 'POST',
          headers: {
            AuthenticationToken: sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sponsor: this.sponsor,
            influencer: this.selected_influencer,
            description: this.description,
            requirement: this.requirement,
            payment_amount: this.payment_amount,
            status: 'Pending'
          })
        });
        if (res.ok) {
          alert('Ad request submitted successfully!');
          this.closeForms();
          this.$router.push('/sponsor_dashboard')
        } else {
          console.error('Failed to submit ad request', await res.text());
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    closeForms() {
      this.currentCampaign_id = null;
      this.description = '';
      this.requirement = '';
      this.payment_amount = null;
      this.selectedCategory = '';
      this.selectedNiche = '';
      this.niches = [];
    }
  }
};

export default ad_request_form;













// const ad_request_form={
//     template:`
//     <div>
//         <h1> 
//             ad request form
//         </h1>
//         <div class="modal-content">
//             <h3>Make AD Request</h3>
//             <div class="form-container">
//               <form @submit.prevent="makeAdRequest"">
//                   <div class="mb-3">
//                       <label for="description" class="form-label">Description</label>
//                       <input type="text" :description class="form-control" id="description" name="message" required>
//                   </div>
//                   <div class="mb-3">
//                       <label for="requirments" class="form-label">Requirements</label>
//                       <input type="text" :requirement class="form-control" id="requirments" name="requirments" required>
//                   </div>
//                   <div class="mb-3">
//                       <label for="payment_amount" class="form-label">Payment</label>
//                       <input type="number" :payment_amount class="form-control" id="payment_amount" name="payment_amout" required>
//                   </div>
//                   <div class="mb-3">
//                     <h2>Search Influencers</h2>
//                       <form >
//                           <div class="form-group">
//                               <label for="category">Select Category:</label>
//                               <select name="category" id="category" class="form-select" @change="updateNiches()" required>
//                                   <option value="">Select Category</option>
                                  
//                                   <script>
//                                       for (var category in categoriesNiches) {
//                                           var option = document.createElement('option');
//                                           option.value = category;
//                                           option.text = category;
//                                           document.getElementById('category').add(option);
//                                       }
//                                   </script>
//                               </select>
//                           </div>
//                           <div class="form-group">
//                               <label for="niche">Select Niche:</label>
//                               <select name="niche" id="niche" class="form-select" required>
//                                   <option value="">Select Niche</option>
//                                   <!-- Options will be populated dynamically based on selected category -->
//                               </select>
//                           </div>
//                           <div class="form-group">
//                               <input type="submit" name="submit" value="Search" class="btn btn-primary w-100">
//                           </div>
//                       </form>
//                       <label for="influencer" class="form-label">Influencer Name</label>
//                       <input type="text" :influencer class="form-control" id="influencer" name="influencer" required>
//                   </div>
//                   <button type="submit" class="btn btn-primary">Submit</button>
//                   <button type="button" class="btn btn-secondary" @click="closeForms">Cancel</button>
//               </form>
//             </div>
//         </div>          
//     </div>
//     `,
//     created() {

//       this.currentCampaign_id = this.$route.params.id;
//       if(sessionStorage.getItem('role')==='sponsor'){
//         this.sponsor=sessionStorage.getItem('email')
//       }
//       else if(sessionStorage.getItem('role'==='influencer')){
//         this.influencer=sessionStorage.getItem('email')
//       }
//       console.log("in created and setting id",this.currentCampaign_id);
//   },
//     data(){
//         return{
//             categoriesNiches : {
//               'Fashion': ['Streetwear', 'High Fashion', 'Sustainable Fashion', 'Plus-Size Fashion', 'Children\'s Fashion'],
//               'Beauty': ['Skincare', 'Makeup Tutorials', 'Haircare', 'Natural/Organic Beauty', 'Men\'s Grooming'],
//               'Lifestyle': ['Minimalism', 'Parenting', 'Home Decor', 'Organization', 'Wellness'],
//               'Fitness and Health': ['Yoga', 'CrossFit', 'Bodybuilding', 'Nutrition', 'Mental Health'],
//               'Travel': ['Luxury Travel', 'Budget Travel', 'Adventure Travel', 'Solo Travel', 'Family Travel'],
//               'Food and Beverage': ['Vegan Cooking', 'Baking', 'Wine Tasting', 'Restaurant Reviews', 'Healthy Recipes'],
//               'Technology': ['Gadgets', 'Software Reviews', 'Gaming', 'Coding Tutorials', 'Tech News'],
//               'Finance': ['Personal Finance', 'Cryptocurrency', 'Investing', 'Real Estate', 'Frugal Living'],
//               'Education': ['Language Learning', 'Science Communication', 'Educational Toys', 'Online Courses', 'Study Tips'],
//               'Entertainment': ['Movie Reviews', 'Music', 'Comedy', 'Theatre', 'Celebrity News'],
//               'Automotive': ['Car Reviews', 'Motorcycles', 'Electric Vehicles', 'Car Maintenance', 'Automotive News'],
//               'Pets': ['Dog Training', 'Cat Care', 'Pet Products', 'Exotic Pets', 'Pet Adoption']
//             },
//             currentCampaign_id: null,
//             influencer:null,
//             sponsor:null,
//             description:null,
//             requirement:null,
//             payment_amount:null,

//         }

//     },
//     methods:{
//       updateNiches() {
//         var categorySelect = document.getElementById('category');
//         var nicheSelect = document.getElementById('niche');
//         var selectedCategory = categorySelect.value;

//         // Clear the niche options
//         nicheSelect.innerHTML = '';

//         // Populate niche options based on selected category
//         if (selectedCategory in categoriesNiches) {
//             categoriesNiches[selectedCategory].forEach(function(niche) {
//                 var option = document.createElement('option');
//                 option.value = niche;
//                 option.text = niche;
//                 nicheSelect.add(option);
//             });
//         }
//     },
//         async makeAdRequest() {
//             const res = await fetch(`${window.location.origin}/make_ad_request/${this.currentCampaign_id}`, {
//               method: 'POST',
//               headers: {
//                 AuthenticationToken: sessionStorage.getItem("token"),
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 campaign_id: this.currentCampaign_id,
//                 sponsor:this.sponsor,
//                 influencer:this.influencer,
//                 description:this.description,
//                 requirement:this.requirement,
//                 payment_amount:this.payment_amount,
//                 status:"Pending"
//               }),
//             });
//             if (res.ok) {
//               alert("Ad request submitted successfully!");
//               this.closeForms();
//             }
//           },
//           closeForms() {
//             this.currentCampaign = null;
//             this.adRequestDetails = '';
//           },

//     }
// }
// export default ad_request_form;