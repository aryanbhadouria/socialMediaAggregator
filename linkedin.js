require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

const app = express();

app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/linkedin/callback',
    scope: ['r_liteprofile', 'r_emailaddress']
}, (accessToken, refreshToken, profile, done) => {
    return done(null, { profile, accessToken });
}));

app.get('/auth/linkedin', passport.authenticate('linkedin'));

app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/profile');
});

app.get('/profile', (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/linkedin');
    }

    res.send(`
        <h1>LinkedIn Profile</h1>
        <pre>${JSON.stringify(req.user.profile, null, 2)}</pre>
    `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
