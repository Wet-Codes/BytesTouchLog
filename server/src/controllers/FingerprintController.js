const { Fingerprint } = require('../models');

module.exports = {
    async uploadFingerprint(req, res) {
        try {

            if (!req.body.fingerprintMinutiae?.Data) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid fingerprint format" 
                });
            }
            
            // Add data length check from sample validation
            const fpData = req.body.fingerprintMinutiae.Data;
            if (fpData.length < 100 || fpData.length > 10000) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid fingerprint data length" 
                });
            }
            
            if (!req.body.fingerprintMinutiae || req.body.fingerprintMinutiae.length !== 4) {
                return res.status(400).json({ success: false, message: 'Capture 4 fingerprints first!' });
            }

            const { name } = req.body;
            const fingerprintSamples = req.body.fingerprintMinutiae;

            if (!name) {
                return res.status(400).json({ success: false, message: 'Name is required' });
            }

            // Store the Base64 fingerprints directly
            await Fingerprint.create({ 
                name, 
                minutiaeData: JSON.stringify(fingerprintSamples) 
            });

            res.json({ success: true, message: `Fingerprint registered for ${name}` });
        } catch (error) {
            console.error("Error uploading fingerprint:", error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    },

    async authorizeFingerprint(req, res) {
        try {
            if (!fingerprintData || fingerprintData.length < 100) { // Basic validity check
                return res.status(400).json({ success: false, message: "Invalid fingerprint data" });
              }
            if (!req.body.fingerprintMinutiae || !req.body.fingerprintMinutiae.Data) {
                return res.status(400).json({ success: false, message: "No valid fingerprint data provided" });
            }
    
            const fingerprintData = req.body.fingerprintMinutiae.Data;
    
            // Get all registered fingerprints
            const allFingerprints = await Fingerprint.findAll();
            let matchedUser = null;
    
            // Check against all stored fingerprints
            for (const fp of allFingerprints) {
                const storedFmds = JSON.parse(fp.minutiaeData);
                if (storedFmds.some(storedFmd => storedFmd.Data === fingerprintData)) {
                    matchedUser = fp;
                    break;
                }
            }
    
            res.json({ 
                success: !!matchedUser,
                name: matchedUser?.name || ""
            });
        } catch (error) {
            console.error("❌ Error authorizing fingerprint:", error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    },

    async scanFingerprint(req, res) {
        res.status(501).json({ 
            success: false, 
            message: "This endpoint is not needed - fingerprint processing happens in Java middleware" 
        });
    }
};