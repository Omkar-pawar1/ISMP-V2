
const Campaign_creation_form = {
    template: `
      <div class="container">
          <div class="form-container">
              <h3>Create Campaign</h3>
              <form >
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
                  <button type="button" class="btn btn-primary w-100" @click="submitForm">Submit</button>
              </form>
          </div>
      </div>
    `,
    data() {
      return {
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
        
      };
    },
    methods: {
      async submitForm() {
        
        const url = window.location.origin + "/create_campaign";
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: {
                "AuthenticationToken": sessionStorage.getItem("token"),
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
            alert("Campaign created successfully!");
            console.log("AuthenticationToken in submitForm",sessionStorage.getItem("token"))
            this.$router.push('/sponsor_dashboard')
            //this.resetForm();
          } else {
            const error = await res.json();
            alert("Error: " + (error.message || "Unable to create campaign"));
          }
        } catch (err) {
          alert("Error: " + err.message);
        }
      },
      // resetForm() {
        
      //     this.name: "",
      //     this.description: "",
      //     this.startDate: "",
      //     this.endDate: "",
      //     this.budget: "",
      //     this.visibility: "",
      //     this.category: "",
      //     this.goals: "",
      
      // },
    },
    mounted() {
      // No need for `window.onload`, Vue's `mounted` is sufficient.
    },
  };
  
  export default Campaign_creation_form;
  