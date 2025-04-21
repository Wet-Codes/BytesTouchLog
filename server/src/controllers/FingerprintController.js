const FingerprintService = require('../services/FingerprintService');
const { Fingerprint } = require('../models');

module.exports = {
    async uploadFingerprint(req, res) {
        try {
            if (!req.body.fingerprintMinutiae || req.body.fingerprintMinutiae.length !== 4) {
                return res.status(400).json({ success: false, message: 'Capture 4 fingerprints first!' });
            }

            const { name } = req.body;
            const fingerprintSamples = req.body.fingerprintMinutiae;

            if (!name) {
                return res.status(400).json({ success: false, message: 'Name is required' });
            }

            await Fingerprint.create({ name, minutiaeData: JSON.stringify(fingerprintSamples) });

            res.json({ success: true, message: `Fingerprint registered for ${name}` });
        } catch (error) {
            console.error("Error uploading fingerprint:", error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    },

    async authorizeFingerprint(req, res) {
        try {
            if (!req.body.fingerprintMinutiae || !req.body.fingerprintMinutiae.Data) {
                console.error("❌ Invalid fingerprint data format received:", req.body);
                return res.status(400).json({ success: false, message: "No valid fingerprint data provided" });
            }
    
            // ✅ Extract the fingerprint minutiae
            const fingerprintData = req.body.fingerprintMinutiae.Data;
    
            console.log("📥 Extracted fingerprint data for identification:", fingerprintData);
    
            // ✅ Identify fingerprint
            const result = await FingerprintService.identifyFingerprint(fingerprintData);
    
            res.json(result);
        } catch (error) {
            console.error("❌ Error authorizing fingerprint:", error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    },

    async scanFingerprint (req, res) {
        
        try {
            const fmd = await FingerprintService.extractMinutiae();
            res.json({ success: true, fmd });
        } catch (error){
            res.status(500).json({ success:false, message: error.message });
        }
    }
    
};
