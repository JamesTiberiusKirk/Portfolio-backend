use portfolio;
db.createUser({user:"api-backend",pwd:passwordPrompt(),roles:[{role:"readWrite",db:"portfolio"}]});
