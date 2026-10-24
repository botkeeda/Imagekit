import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: { bodyParser: false },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const privateKey = "private_OBhaXibMoYiOEHfSS2u1zOvHOgI="; // Aapki key
    const form = formidable({ multiples: false });

    return new Promise((resolve) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.status(500).json({ error: 'File parsing error: ' + err.message });
                return resolve();
            }

            const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
            const fileName = Array.isArray(fields.fileName) ? fields.fileName[0] : fields.fileName;

            if (!uploadedFile) {
                res.status(400).json({ error: 'No file found in the request.' });
                return resolve();
            }

            try {
                // File ko buffer (memory) mein read karein
                const fileBuffer = fs.readFileSync(uploadedFile.filepath);
                
                // ImageKit ko Base64 string bhejein (Yeh Vercel par 100% kaam karta hai)
                const base64File = fileBuffer.toString('base64');

                const formData = new FormData();
                formData.append('file', base64File); // Base64 string
                formData.append('fileName', fileName || uploadedFile.originalFilename || 'upload.png');

                const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
                    method: 'POST',
                    headers: { 
                        'Authorization': 'Basic ' + Buffer.from(privateKey + ':').toString('base64') 
                    },
                    body: formData
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    res.status(200).json(data);
                } else {
                    res.status(response.status).json({ error: data.message || 'ImageKit upload failed' });
                }
            } catch (error) {
                res.status(500).json({ error: 'Upload processing error: ' + error.message });
            }
            resolve();
        });
    });
}
