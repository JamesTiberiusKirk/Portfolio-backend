db = db.getSiblingDB('portfolio');
db.createUser({ user: "portfolio-api", pwd: "test", roles: [{ role: "readWrite", db: "portfolio" }] });
db.createCollection('users');

db.users.insertOne({
    username: 'darthvader',
    password: '$2a$10$oTOcg0q1QLYgTJcw0Slss.A/esxPCk7cr1tnsb/B.BCRPN33q0mIq',
    sessions: []
});