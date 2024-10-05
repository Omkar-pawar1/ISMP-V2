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
        Signup
        <label>Email:</label>
        <input type="email" placeholder="Enter your email" />
        
        <label>Password:</label>
        <input type="password" placeholder="Enter your password" />
  
        <div>
          Select your category
          <label>Sponsor:</label>
          <input type="radio" name="options" value="Sponsor"  />
  
          <label>Influencer:</label>
          <input type="radio" name="options" value="Influencer" checked/>
        </div>
      </div>
    `
  };
  