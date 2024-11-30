
const dashboard_sponsor={
    template:
    `  
    <div> 
        <h1>Welcome this is Sponsor dashborar </h1>
        
        <div>
            <h2> 
                Create campaigns
            </h2>
                <button @click="create_csv"> Get Campaign Data </button>
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
    methods : {
        async create_csv(){
            const res = await fetch(window.location.origin + '/create-csv', {
                headers : {
                    'Authentication-Token' : localStorage.getItem('token')
                }
            })
            const task_id = (await res.json()).task_id

            const interval = setInterval(async() => {
                const res = await fetch(`${window.location.origin}/get-csv/${task_id}` )
                if (res.ok){
                    console.log('data is ready')
                    window.open(`${window.location.origin}/get-csv/${task_id}`)
                    clearInterval(interval)
                }

            }, 100)
            
        },
    },

}

export default dashboard_sponsor;