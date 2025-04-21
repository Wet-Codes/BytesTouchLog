const { execSync } = require('child_process'); //Self Calling for Stacking 
const path = require('path'); // Path method

module.exports = {
    extractMinutiae
};


async function extractMinutiae() { // Function
    try {
         const javaPath = path.join(__dirname, '../../../fingerprint-java/run.bat');
         const result = execSync(javaPath, {encoding: 'utf-8' }).trim();

        //FMD JSON returned by Java must be like: {Data: [...]}
        return JSON.parse(result);

    } catch(err) {
        console.error(" Java Fingerprint Scan Failed", err);
        throw new Error("Java Fingerprint Scan Failed");
        
    }



    }