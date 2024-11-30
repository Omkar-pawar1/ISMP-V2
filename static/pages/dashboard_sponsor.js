
const dashboard_sponsor={
    template:
    `  
    <div> 
        <h1>Welcome this is Sponsor dashborar </h1>
        
        <div>
            <h2> 
                Create campaigns
            </h2>
                Add CURD functionality to campaigns
            <ol>
                for campaigns
                <li>If want then Create AD Requests </li>
                <li>Also add CURD operations for Ad Requests</li>
            </ol>
        </div>
        <div>Search inflencers</div>
        <div>My campaigns</div>
        <router-link to="/create_campaign">Create Campaign here </router-link>
        <router-link to="/my_campaigns">See Campaigns</router-link>
        <router-view></router-view> 
    </div>
    
    
    `,

}

export default dashboard_sponsor;