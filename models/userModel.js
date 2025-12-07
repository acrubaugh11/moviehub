"use strict";

const pool = require('./db');

async function getUserByGoogleId(googleId) {
  const result = await pool.query(
    'SELECT * FROM users WHERE googleId = $1',
    [googleId]
  );
  return result.rows[0];
}

async function createNewUser({ googleId, displayName, firstName, lastName, email }) {
  const queryText = `
    INSERT INTO users (googleId, displayName, firstName, lastName, email)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [googleId, displayName, firstName, lastName, email];
  const result = await pool.query(queryText, values);
  return result.rows[0];
}

module.exports = {
  getUserByGoogleId,
  createNewUser
};
