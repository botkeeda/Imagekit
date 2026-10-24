import { config } from '../config.js';
import formidable from 'formidable';
import fs from 'fs';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const form = formidable({ multiples: false });
    
    return new Promise((resolve) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.status(500).json({ error: 'File parsing error' });
                return resolve();
            }

            // Vercel forms files as arrays in newer versions
            const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
            const fileName = Array.isArray(fields.fileName) ? fields.fileName[0] : fields.fileName;

            if (!uploadedFile) {
                res.status(400).json({ error: 'No file found' });
                return resolve();
            }

            const privateKey = config.IMAGEKIT_PRIVATE_KEY;
            const formData = new FormData();
            formData.append('file', fs.createReadStream(uploadedFile.filepath));
            formData.append('fileName', fileName || uploadedFile.originalFilename);

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
            resolve();
        });
    });
}
