const path = require('path');

module.exports = {
  content: [
    path.resolve(__dirname, 'web/src/**/*.{html,js}').replace(/\\/g, '/'),
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Cascadia Code'", "'Fira Code'", "'SF Mono'", "'Consolas'", 'monospace'],
      },
    },
  },
  plugins: [],
};
