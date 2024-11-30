const infProfile={
    template:`
    <div class="form-container">
        <form>
                <div class="mb-3">
                      <label for="name" class="form-label">Enter Name</label>
                      <input type="text" class="form-control" id="name" name="name" v-model="name" required>
                </div>
                 <div class="mb-3">
                      <label for="platform" class="form-label">Select Platform</label>
                      <select class="form-select" id="visibility"  name="platform" v-model="platform" required>
                          <option value="">Select here</option>
                          <option value="Instagram">Instagram</option>
                          <option value="Youtube">Youtube</option>
                          <option value="Facebook">Facebook</option>                          

                      </select>
                  </div>
                <div class="mb-3">
                      <label for="reach" class="form-label">Reach</label>
                      <input type="number" class="form-control" id="reach" name="reach" v-model="reach" required>
                </div>
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
                    <button type="button" value="Search" class="btn btn-primary w-100" @click="setProfile(selectedCategory,selectedNiche)">Save</button>
              </div>
        </form>
    </div>
    `,
    data(){
        return{
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
            niches: [],
            selectedCategory:null,
            selectedNiche:null,
            name:null,
            platform:null,
            reach:null,


        }
    },
    methods:{
        updateNiches() {
            this.niches = this.categoriesNiches[this.selectedCategory] || [];
        },
        async setProfile(){
            const res=await fetch(`${window.location.origin}/setinfProfile`,{
                method:"POST",
                headers:{
                    AuthenticationToken: sessionStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    email:sessionStorage.getItem('email'),
                    name:this.name,
                    platform:this.platform,
                    reach:this.reach,
                    category:this.selectedCategory,
                    niche:this.selectedNiche
                })

            })
            if(res.ok){
                alert("Profile saved")
                this.$router.push('/influencer_dashboard')
            }
            else{
                console.error("opps something went wrong")
            }

        },

    },
}
export default infProfile;