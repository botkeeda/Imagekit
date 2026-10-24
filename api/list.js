export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    // APNI PRIVATE KEY YAHAN DAALEIN
    const privateKey = "private_OBhaXibMoYiOEHfSS2u1zOvHOgI=";

    try {
        const response = await fetch('https://api.imagekit.io/v1/files?limit=100', {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(privateKey + ':').toString('base64'),
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        if (response.ok) {
            res.status(200).json(data);
        } else {
            res.status(response.status).json({ error: data.message || 'List failed' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
