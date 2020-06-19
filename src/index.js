const instagram = require('./instagram');

(async()=>{
    await instagram.initialize();

    await instagram.login(process.env.USERNAME, process.env.PASSWORD);

    await instagram.likeAndFollowTagsProccess(['feliz']);

    await instagram.unfollowUser();
})()