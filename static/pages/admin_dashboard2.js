const admin_dashboard2 = {
    template: `
      <div>
          <h1> Admin Dashboard </h1>
          <h2> Inactive Sponsors </h2>
          <div v-for="user in inactiveInst">
              <div class="justify"> <span> email : {{user.email}} </span> <span> <button class="btn btn-secondary" @click="activate(user.id)"> Activate </button> </span> </div>
          </div>

          <div class="container dashboard-container">
                    
                    
                    <!-- Influencers Section -->
                    <div class="section-header">Influencers</div>
                    <ul class="list-group">
                      <li 
                        class="list-group-item" 
                        v-for="influencer in influencers" 
                        :key="influencer.id"
                      >
                        <span>{{ influencer.name }}</span>
                        <span>
                          <button 
                            class="btn btn-info btn-sm" 
                            @click="viewInfluencer(influencer.id)"
                          >
                            View
                          </button>
                          <button 
                            v-if="influencer.active === true " 
                            class="btn btn-warning btn-sm" 
                            @click="flagInfluencer(influencer.id)"
                          >
                            Flag
                          </button>
                          <button 
                            v-else 
                            class="btn btn-success btn-sm" 
                            @click="unflagInfluencer(influencer.id)"
                          >
                            Unflag
                          </button>
                        </span>
                      </li>
                    </ul>
                    
                    <!-- Sponsors Section -->
                    <div class="section-header">Sponsors</div>
                    <ul class="list-group">
                      <li 
                        class="list-group-item" 
                        v-for="sponsor in sponsors" 
                        :key="sponsor.id"
                      >
                        <span>{{ sponsor.name }}</span>
                        <span>
                          <button 
                            class="btn btn-info btn-sm" 
                            @click="viewSponsor(sponsor.id)"
                          >
                            View
                          </button>
                          <button 
                            v-if="sponsor.active === true " 
                            class="btn btn-warning btn-sm" 
                            @click="flagSponsor(sponsor.id)"
                          >
                            Flag
                          </button>
                          <button 
                            v-else 
                            class="btn btn-success btn-sm" 
                            @click="unflagSponsor(sponsor.id)"
                          >
                            Unflag
                          </button>
                        </span>
                      </li>
                    </ul>
            </div>






      </div>
    `,
    data() {
      return {
        inactiveInst: [],
        influencers: [], // Array of influencers
        sponsors: [] 
      };
    },
    methods: {
      async activate(user_id){
        const res = await fetch(`${window.location.origin}/activate_sponsors/${user_id}`, {
          headers: {
            AuthenticationToken: sessionStorage.getItem("token"),
          },
        });
    
        if (res.ok) {
          alert("Activated")
          this.fetchInactiveSpon()

        }
        else{
          console.error("error occured")

        }
      },
      async fetchInactiveSpon(){
        const res = await fetch(window.location.origin + "/inactive_sponsors", {
          headers: {
            AuthenticationToken: sessionStorage.getItem("token"),
          },
        });
    
        if (res.ok) {
          this.inactiveInst = await res.json();
          console.log('token',sessionStorage.getItem("token"))
        }

      },
      async fetchSponsor(){
        const res = await fetch(window.location.origin + "/all_sponsors", {
          headers: {
            AuthenticationToken: sessionStorage.getItem("token"),
          },
        });
    
        if (res.ok) {
          this.sponsors = await res.json();
          console.log(this.sponsors)
          
        }else{
          alert("error occured")
        }

      },
      async fetchInfluencers(){
        const res = await fetch(window.location.origin + "/all_influencers", {
          headers: {
            AuthenticationToken: sessionStorage.getItem("token"),
          },
        });
    
        if (res.ok) {
          this.influencers = await res.json();
          console.log(this.influencers)
          
        }else{
          alert("error occured")
        }

      },
      
      async viewInfluencer(id) {
        this.$router.push(`/infuencerDetails/${id}`)
      },
      async flagInfluencer(id) {

        const res = await fetch(`${window.location.origin}/flag_influencer/${id}`, {
          headers: {
            AuthenticationToken: sessionStorage.getItem("token"),
          },
        });
    
        if (res.ok) {
          alert("Flagged")
          this.fetchInfluencers()

        }
        else{
          console.error("error occured")

        }
        // Logic for flagging an influencer
        console.log(`Flagging influencer with ID: ${id}`);
      },
      async unflagInfluencer(id) {
        const res = await fetch(`${window.location.origin}/unflag_influencer/${id}`, {
          headers: {
            AuthenticationToken: sessionStorage.getItem("token"),
          },
        });
    
        if (res.ok) {
          alert("UnFlagged")
          this.fetchInfluencers()

        }
        else{
          console.error("error occured")

        }

        
        // Logic for unflagging an influencer
        console.log(`Unflagging influencer with ID: ${id}`);
      },
      async viewSponsor(id) {
        const res = await fetch(`${window.location.origin}/sponsor_details/${id}`, {
          headers: {
            AuthenticationToken: sessionStorage.getItem("token"),
          },
        });
    
        if (res.ok) {
          alert("VS")
          this.fetchSponsor()

        }
        else{
          console.error("error occured")

        }
        
        // Logic for viewing sponsor details
        //this.$router.push({ name: 'sponsorDetails', params: { id } });
      },
      async flagSponsor(id) {

        const res = await fetch(`${window.location.origin}/flag_sponsor/${id}`, {
          headers: {
            AuthenticationToken: sessionStorage.getItem("token"),
          },
        });
    
        if (res.ok) {
          alert("Flagged")
          this.fetchSponsor()

        }
        else{
          console.error("error occured")

        }

        // Logic for flagging a sponsor
        console.log(`Flagging sponsor with ID: ${id}`);
      },
      async unflagSponsor(id) {

        const res = await fetch(`${window.location.origin}/unflag_sponsor/${id}`, {
          headers: {
            AuthenticationToken: sessionStorage.getItem("token"),
          },
        });
    
        if (res.ok) {
          alert("UNFlagged")
          this.fetchSponsor()

        }
        else{
          console.error("error occured")

        }
        // Logic for unflagging a sponsor
        console.log(`Unflagging sponsor with ID: ${id}`);
      }
    },
    async mounted() {
      this.fetchInactiveSpon()
      this.fetchInfluencers()
      this.fetchSponsor()
    },
  };
  
  export default admin_dashboard2;