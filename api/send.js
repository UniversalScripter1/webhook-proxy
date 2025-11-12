const axios = require('axios'); 

module.exports = async (req, res) => {
    // Vercel securely gives us the secret URL via environment variables
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK;

    if (!DISCORD_WEBHOOK_URL) {
        return res.status(500).json({ error: 'Server not configured.' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Forward the client's data (the Discord payload) to the secret URL
        const discordResponse = await axios.post(
            DISCORD_WEBHOOK_URL, 
            req.body 
        );

        res.status(discordResponse.status).json({ message: 'Success' });

    } catch (error) {
        res.status(500).json({ error: 'Failed to send webhook' });
    }
};
  
