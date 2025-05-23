module.exports = {
  generateStudentId: () => {
    const randomString = Math.random().toString(36).substr(2, 6).toUpperCase();
    const timestamp = Date.now().toString().substr(-4);
    return `STU-${timestamp}-${randomString}`;
  }
};