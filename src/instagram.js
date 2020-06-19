const puppeteer = require('puppeteer');
const unfollowUser = require("./model/unfollowUser");

const BASE_URL = 'https://instagram.com/';
const TAG_URL = (tag) => `https://www.instagram.com/explore/tags/${tag}/`;
const USER_URL = (user) => `https://www.instagram.com/${user}/`;

const instagram = {
    browser: null,
    page: null,

    initialize: async () => {
        instagram.browser = await puppeteer.launch({
            headless: false
        });

        instagram.page = await instagram.browser.newPage();
    },

    login: async (username, password) => {       
        await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });

        await instagram.page.waitFor(1000);

        await instagram.page.type('input[name="username"]', username, {delay: 50});
        await instagram.page.type('input[name="password"]', password, {delay: 50});

        let loginButton = await instagram.page.$x('//div[contains(text(), "Entrar")]');

        await loginButton[0].click();

        await instagram.page.waitFor(10000);
    },    
    likeAndFollowTagsProccess: async (tags = []) => {
        for(let tag of tags){
            await instagram.page.goto(TAG_URL(tag), { waitUntil: 'networkidle2' });
            await instagram.page.waitFor(1000);

            let posts = await instagram.page.$$('article > div:nth-child(3) img[decoding="auto"]');

            for(let i =0; i < process.env.NUMBER_LIKES; i++){
                let post = posts[i];

                await post.click();
                
                await instagram.page.waitFor('div[id="react-root"]');
                await instagram.page.waitFor(1000);

                const names = await instagram.page.$$('div.e1e1d > a');
                const name = await instagram.page.evaluate(names => names.textContent, names[0]);
                instagram.saveUserInDB(name);
                if(name){
                    let isFollowed = await instagram.page.$x('//button[contains(text(), "Seguir")]');
                    let isLikeble = await instagram.page.$('svg[aria-label="Curtir"]');
                    
                    await instagram.page.waitFor(1000);

                    if(isFollowed){
                        await isFollowed[1].click('//button[contains(text(), "Seguir")]');
                    }

                    await instagram.page.waitFor(1000);

                    if(isLikeble){
                        await instagram.page.click('svg[aria-label="Curtir"]');
                    }               
                }                
                
                await instagram.page.waitFor(2000);

                await instagram.page.click('svg[aria-label="Fechar"]');
                
                await instagram.page.waitFor(2000);
            }
            await instagram.page.waitFor(5000);
        }
    },
    unfollowUser: async () => {
        const usernames = await instagram.findUserInDB();
        for(let username of usernames){            
            await instagram.page.goto(USER_URL(username), { waitUntil: 'networkidle2' });
            await instagram.page.waitFor(1000);      
            
            let isFollowed = await instagram.page.$('span[aria-label="Seguindo"]');         
            if(isFollowed){
                await isFollowed[1].click('span[aria-label="Seguindo"]');
                await instagram.page.waitFor(1000); 
                await instagram.page.$x('//button[contains(text(), "Deixar de seguir")]')[0].click();
            }   
            await instagram.page.waitFor(3000);  
            instagram.deleteUserInDB(username);
        }
    },
    saveUserInDB: async (user) => {        
        await unfollowUser.create({name: user});
    },
    findUserInDB: async () => {   
        let usernames = [];     
        await unfollowUser.find({}, function(err, docs) {
            if (!err) { 
                for(let doc in docs){
                    usernames.push(docs[doc].name);
                }
                              
            }
        });
        console.log(usernames);
        return usernames;
    },
    deleteUserInDB: async (user) => {        
        await unfollowUser.findOneAndDelete({name: user});
    }
}

module.exports = instagram;