const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  remotes: {
    "mfeAuth": "mfeAuth@http://localhost:4201/remoteEntry.js",
    "mfeDashboard": "mfeDashboard@http://localhost:4202/remoteEntry.js",
    "mfeProjects": "mfeProjects@http://localhost:4203/remoteEntry.js",
    "mfeAdmin": "mfeAdmin@http://localhost:4204/remoteEntry.js",
    "mfeTasks": "mfeTasks@http://localhost:4205/remoteEntry.js",
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
