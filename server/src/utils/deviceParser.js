const UAParser = require('ua-parser-js');

module.exports = (userAgent) => {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  
  return {
    browser: result.browser.name || 'Unknown',
    os: result.os.name || 'Unknown',
    device: result.device.type || 'Desktop',
    full: `${result.browser.name || 'Unknown'} on ${result.os.name || 'Unknown'}`
  };
};