const Fingerprint = require('../models/Fingerprint');

module.exports = {
    async enrollFingerprint(req, res) {
        try {
            const { name, samples } = req.body;
            
            if (!name || !samples || samples.length !== 4) {
                return res.status(400).json({ 
                    success: false, 
                    error: "Name and 4 fingerprint samples are required" 
                });
            }

            // Store raw samples (let frontend handle template creation)
            const fingerprint = await Fingerprint.create({
                name,
                fingerprintData: samples, // Store raw samples instead of template
                fingerprintTemplate: null, // Will be generated on client side
                userId: req.user?.id || null
            });

            res.json({ 
                success: true,
                id: fingerprint.id 
            });
        } catch (error) {
            console.error("Enrollment error:", error);
            res.status(500).json({ 
                success: false, 
                error: "Fingerprint enrollment failed" 
            });
        }
    },

    async verifyFingerprint(req, res) {
        try {
            const { sample } = req.body;
            
            if (!sample) {
                return res.status(400).json({ 
                    success: false, 
                    error: "Fingerprint sample is required" 
                });
            }

            // Get the user's stored fingerprint
            const fingerprint = await Fingerprint.findOne({
                where: { userId: req.user.id }
            });
            
            if (!fingerprint) {
                return res.json({ 
                    success: true,
                    match: false,
                    message: "No fingerprint registered for this user"
                });
            }

            // Return the stored samples for client-side comparison
            res.json({ 
                success: true,
                samples: fingerprint.fingerprintData,
                name: fingerprint.name 
            });
        } catch (error) {
            console.error("Verification error:", error);
            res.status(500).json({ 
                success: false, 
                error: "Fingerprint verification failed" 
            });
        }
    },

    async identifyFingerprint(req, res) {
        try {
            const { sample } = req.body;
            
            if (!sample) {
                return res.status(400).json({ 
                    success: false, 
                    error: "Fingerprint sample is required" 
                });
            }

            // Get all stored fingerprints
            const fingerprints = await Fingerprint.findAll();
            
            // Return all fingerprints for client-side comparison
            res.json({ 
                success: true,
                fingerprints: fingerprints.map(fp => ({
                    id: fp.id,
                    name: fp.name,
                    samples: fp.fingerprintData,
                    userId: fp.userId
                }))
            });
        } catch (error) {
            console.error("Identification error:", error);
            res.status(500).json({ 
                success: false, 
                error: "Fingerprint identification failed" 
            });
        }
    }
};