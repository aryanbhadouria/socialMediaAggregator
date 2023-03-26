require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

const twitterApiUrl = 'https://api.twitter.com/2/tweets/search/recent';

app.get('/tweets', async (req, res) => {
    const query = req.query.q || 'OpenAI';

    try {
        const response = await axios.get(twitterApiUrl, {
            headers: { 'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}` },
            params: { query }
        });

        const tweets = response.data.data.map(tweet => ({
            id: tweet.id,
            text: tweet.text,
        }));

        res.json(tweets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching tweets' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
