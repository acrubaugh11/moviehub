const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.SECRET_KEY,
      callbackURL: `${process.env.VITE_BACKEND_API_BASE_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleid = profile.id;
        const displayname = profile.displayName;
        const email = profile.emails[0].value;
        const firstname = profile.name.givenName;
        const lastname = profile.name.familyName;

        let res = await pool.query("SELECT * FROM users WHERE googleid=$1", [googleid]);

        if (!res.rows.length) {
          res = await pool.query(
            "INSERT INTO users (googleid, displayname, firstname, lastname, email) VALUES ($1,$2,$3,$4,$5) RETURNING *",
            [googleid, displayname, firstname, lastname, email]
          );
        }

        done(null, res.rows[0]);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.googleid);
});

passport.deserializeUser(async (googleid, done) => {
  try {
    const res = await pool.query("SELECT * FROM users WHERE googleid=$1", [googleid]);
    done(null, res.rows[0] || null);
  } catch (err) {
    done(err);
  }
});
