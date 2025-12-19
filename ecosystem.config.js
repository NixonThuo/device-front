module.exports = {
  apps: [
    {
      name: "device-front",
      // Use npm start to run the production Next.js server
      script: "npm",
      args: "start",
      cwd: "/home/device-portal/frontend",
      env: {
        NODE_ENV: "production"
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3001
      },
      restart_delay: 5000,
      autorestart: true,
      watch: false,
      instances: 1,
      exec_mode: "fork"
    }
  ]
};
