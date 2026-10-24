// api/upload.js
import { config } from '../config.js';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: { bodyParser: false }, // Formidable use karne ke liye
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const form = new formidable.IncomingForm();
    
    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: 'File parsing error' });

        const file = files.file[0];
        if (!file) return res.status(400).json({ error: 'No file found' });

        const privateKey = config.IMAGEKIT_PRIVATE_KEY;
        
        // ImageKit expects a FormData object
        const formData = new FormData();
        formData.append('file', fs.createReadStream(file.filepath));
        formData.append('fileName', file.originalFilename);

        try {
            const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
                method: 'POST',
                headers: { 'Authorization': 'Basic ' + Buffer.from(privateKey + ':').toString('base64') },
                body: formData
            });
            const data = await response.json();
            
            if (response.ok) {
                res.status(200).json(data);
            } else {
                res.status(response.status).json({ error: data.message || 'Upload failed' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
                                                            }
          
