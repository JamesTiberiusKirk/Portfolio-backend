use portfolio;
db.createUser({user:"portfolio-api",pwd:passwordPrompt(),roles:[{role:"readWrite",db:"portfolio"}]});
