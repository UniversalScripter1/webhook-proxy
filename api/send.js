const axios = require('axios'); 

module.exports = async (req, res) => {
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK;

    if (!DISCORD_WEBHOOK_URL) {
        return res.status(500).json({ error: 'Server not configured.' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // --- CRITICAL STEP: Ensure the request body is valid ---
    let payload = req.body;

    if (!payload || Object.keys(payload).length === 0) {
        return res.status(400).json({ error: 'Missing or empty Discord payload in request body.' });
    }
    // --------------------------------------------------------

    try {
        // Forward the client's data (the Discord payload) to the secret URL
        const discordResponse = await axios.post(
            DISCORD_WEBHOOK_URL, 
            payload // Use the validated payload
        );

        // Success codes from Discord are usually 204 or 200
        res.status(200).json({ message: 'Success. Webhook forwarded.' });

    } catch (error) {
        // If Discord gives a specific error (like the 401), we log it.
        console.error('Error forwarding webhook:', error.response ? error.response.status : error.message);
        
        // Return the actual status code from Discord if available, otherwise 500
        const status = error.response ? error.response.status : 500;
        const details = error.response ? error.response.data : error.message;

        res.status(status).json({ error: 'Failed to send webhook to Discord.', details: details });
    }
};
