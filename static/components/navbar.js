
export default {
    data() {
      return {
        email:"",
        password:"",
        role:""
      };
    },
    template: `
      <div>
      <router-link to="/login">Login </router-link>
      <router-link to="/register">Register</router-link>
      <router-link to="/admin_dashboard2">Dashboard</router-link>
      <button class="btn btn-warning text-xl"  @click="logout">Logout</button>

        
      </div>
    `,

  methods: {
    logout() {
      // clear session
      sessionStorage.clear();

      // clear vuex login info
      // this.$store.commit("logout");
      // this.$store.commit("setRole", null);

      this.$router.push("/logout");
    },
  },
  };
  