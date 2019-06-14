const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

module.exports = {
    findUsers,
    findBy,
    addUser}
    function addUser(user){
        return db('users').insert(user)
    }

    function findUsers(){
        return db('users')
    }

    function findBy(filter) {
        return db('users').where(filter);
      }

      