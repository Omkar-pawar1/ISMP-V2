const influencerDetails = {
    template: `
      <div @click="back_to" class="container details-container">
          <div v-if="influencer" class="details-list">
              <h2>Influencer Details</h2>
              <ul>
                  <li>Name: {{ influencer.name }}</li>
                  <li>Reach: {{ influencer.reach }}</li>
                  <li>Category: {{ influencer.category }}</li>
                  <li>Niche: {{ influencer.niche }}</li>
              </ul>
          </div>
          <div v-else>
              <p>Loading influencer details...</p>
          </div>
      </div>
    `,
    data() {
      return {
        influencer: null,
      };
    },
    methods: {
      back_to() {
        this.$router.push('/admin_dashboard2'); // Use $router.push, not $route.push
      },
      async viewInfluencer() {
        const id = this.$route.params.id;
        try {
          const res = await fetch(`${window.location.origin}/influencer_details/${id}`, {
            headers: {
              AuthenticationToken: sessionStorage.getItem("token"),
            },
          });
  
          if (res.ok) {
            this.influencer = await res.json(); // Correctly parse the JSON response
          } else {
            console.error("Error occurred while fetching influencer details");
          }
        } catch (error) {
          console.error("An unexpected error occurred:", error);
        }
      },
    },
    mounted() {
      this.viewInfluencer(); // Call viewInfluencer in mounted lifecycle hook
    },
  };
  export default influencerDetails;
  