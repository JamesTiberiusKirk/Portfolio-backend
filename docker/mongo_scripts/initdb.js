db = db.getSiblingDB('portfolio');
db.createUser({ user: "portfolio-api", pwd: "test", roles: [{ role: "readWrite", db: "portfolio" }] });
db.createCollection('users');

db.users.insertOne({
    username: 'darthvader',
    password: '$2a$10$BdtaxR5G2YZ7T5gfOvqi3.q5FkbQNTn2GxyasxEmXyAMnCEs.86Qu',
    sessions: []
});
