export default function handler(req, res) {
    // Caching ko rokhne ke liye
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    
    // 4-digit password yahan set karo
    res.status(200).json({ password: "1238" }); 
}
