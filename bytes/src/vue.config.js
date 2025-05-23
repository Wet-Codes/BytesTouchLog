module.exports = {
  lintOnSave: false, // Disable auto-linting
  chainWebpack: config => {
    config.module.rule('eslint').exclude.add(/server/);
  }
};