module.exports = [
  {
    files: ['**/*.js'],
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.min.js',
      'fingerprint.sdk.min.js'
    ],
    rules: {
      // you can add custom rules here if needed
    }
  }
];