module.exports = {
    apps: [
      {
        name: 'midway-koa-upload',
        script: 'bootstrap.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'production',
        },
      },
      {
        name: 'update-service',
        script: './dist/server/server.js', // 假设你的 Koa 服务器入口文件是 koa-server.js
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };