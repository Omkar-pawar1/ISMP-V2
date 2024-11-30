const login = {

    template: `
     <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4 border rounded-3 ">
        <h3 class="card-title text-center mb-4">Login</h3>
        <div class="form-group mb-3">
          <input v-model="email" type="email" class="form-control" placeholder="Email" required/>
        </div>
        <div class="form-group mb-4">
          <input v-model="password" type="password" class="form-control" placeholder="Password" required/>
        </div>
        <button class="btn btn-primary w-100" @click="submitInfo">Submit</button>
      </div>
    </div>
  `,
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async submitInfo() {
      const url = window.location.origin;
      const res = await fetch(url + "/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: this.email, password: this.password }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Login response data:",data)
        if(!data.active){
          alert("Please wait for approval")
          this.email=""
          this.password=""
          
        }
        else{
          sessionStorage.setItem("token", data.token);
          console.log("In login.js and this is tokenn",sessionStorage.getItem("token"));
          sessionStorage.setItem("role", data.role);
          sessionStorage.setItem("email", data.user);
  
         console.log("In login.js and this is role",sessionStorage.getItem("role"));
          console.log("in login.js and this is email",sessionStorage.getItem('email'));
  
  
          // add data to vuex
          // this.$store.commit("setRole", data.role);
          // this.$store.commit("setLogin", true);
  
          switch (data.role) {
            case "sponsor":
              this.$router.push("/sponsor_dashboard");
              break;
            case "influencer":
              this.$router.push("/influencer_dashboard");
              break;
            case "admin":
              this.$router.push("/admin_dashboard2");
          }

        }

       
      } else {
        console.error("Login Failed");
      }
    },
  },
};
export default login