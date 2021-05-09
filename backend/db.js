export const db = {
    users:[
        {
            username:'_rishabhchandra',  name:'Rishabh Chandra', password:'admin', tokenVersion:1,
        },
        {
            username:'kadiankanika', name:'Kanika Kadian', password:'admin', tokenVersion:1,
        },
        {
            username:'admin', name:'DOGEFATHER', password:'admin', tokenVersion:1,
        },
    ]
}


export const getUserTokenVersion = (username)=>{
    for(let user of db.users){
        if(user.username === username) return user.tokenVersion;
    }
    return null;
}

