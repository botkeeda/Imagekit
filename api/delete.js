export default async function handler(req, res) {
    if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

    const { fileId } = req.query;
    if (!fileId) return res.status(400).json({ error: 'fileId required' });

    // APNI PRIVATE KEY YAHAN DAALEIN
    const privateKey = "private_OBhaXibMoYiOEHfSS2u1zOvHOgI=";

    try {
        const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(privateKey + ':').toString('base64')
            }
        });
        
        if (response.ok || response.status === 204) {
            res.status(200).json({ message: 'Deleted successfully' });
        } else {
            const data = await response.json().catch(() => ({}));
            res.status(response.status).json({ error: data.message || 'Delete failed' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
