export default {
  template: `
    <div>
        <h3>Signup</h3>
        <div>
          <label for="email">Email:</label>
          <input id="email" type="email" placeholder="Enter your email" v-model="email" required>
        </div>
        
        <div>
          <label for="password">Password:</label>
          <input id="password" type="password" placeholder="Enter your password" v-model="password" required>
        </div>
        
        <div>
            <label for="role">Select your category:</label>
            <select id="role" v-model="role" required>
              <option value="" disabled>Select a category</option>
              <option value="sponsor">Sponsor</option>
              <option value="influencer">Influencer</option>
            </select>
        </div>
        
        <button type="button" @click="register">Register</button>
    </div>
  `,
  data() {
    return {
      email: "",
      password: "",
      role: "",
    };
  },
  methods: {
    async register() {
      if (!this.email || !this.password || !this.role) {
        alert("Please fill all the fields!");
        return;
      }

      try {
        const res = await fetch(`${window.location.origin}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            role: this.role,
          }),
        });

        if (res.ok) {
          alert("Registered Successfully");
          this.$router.push('/login');
        } else {
          const error = await res.json();
          alert(`Registration Failed: ${error.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again later.");
      }
    },
  },
};
