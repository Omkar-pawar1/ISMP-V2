const admin_dashboard2 = {
    template: `
      <div>
          <h1> Admin Dashboard </h1>
          <h2> Inactive Sponsors </h2>
          <div v-for="user in inactiveInst">
              <div class="justify"> <span> email : {{user.email}} </span> <span> <button class="btn btn-secondary" @click="activate(user.id)"> Activate </button> </span> </div>
          </div>
      </div>
    `,
    data() {
      return {
        inactiveInst: [],
      };
    },
    // methods: {
    //   async activate(id) {
    //     const res = await fetch(window.location.origin + "/activate-inst/" + id, {
    //       headers: {
    //         AuthenticationToken: sessionStorage.getItem("token"),
    //       },
    //     });
  
    //     if (res.ok) {
    //       alert("sponsor activated");
    //     }
    //   },
    // },
    async mounted() {
      const res = await fetch(window.location.origin + "/inactive_sponsors", {
        headers: {
          AuthenticationToken: sessionStorage.getItem("token"),
        },
      });
  
      if (res.ok) {
        this.inactiveInst = await res.json();
      }
    },
  };
  
  export default admin_dashboard2;