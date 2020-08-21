require("dotenv").config();
const instagram = require("./instagram");

(async () => {
  await instagram.initialize();
  await instagram.login(
    process.env.INSTAGRAM_USERNAME,
    process.env.INSTAGRAM_PASSWORD
  );

  await instagram.followUsersFollowers([]);
  await instagram.close();
})();
