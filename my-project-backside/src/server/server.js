const Koa = require('koa');
const Router = require('koa-router');
const {koaBody} = require('koa-body');
const cors = require('@koa/cors');
const path = require('path');
const fs = require('fs');

const app = new Koa();
const router = new Router();
const port = 3000;

// 设置存储路径和文件名
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use(cors());
// 配置 koa-body 中间件
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: uploadDir,
    keepExtensions: true,
    maxFileSize: 200 * 1024 * 1024, // 设置最大文件大小为 200MB
    onFileBegin: (name, file) => {
      const fileName = `${Date.now()}-${file.name}`;
      file.path = path.join(uploadDir, fileName);
      file.name = fileName;
    }
  }
}));




router.post('/upload', async (ctx) => {
  console.log('Handling /upload request');
  // console.log('Request body:', ctx.request.body);
  // console.log('Request files:', ctx.request.files);
  const file = ctx.request.files; // 获取上传的文件

  if (!file) {
    ctx.status = 400;
    ctx.body = 'No file uploaded.';
    return;
  }

  try {
    const fileUrl = `${ctx.origin}/${file.image.newFilename}`;
    console.log('File URL:', fileUrl); // 打印文件 URL

    ctx.status = 200;
    ctx.body = { message: 'File uploaded successfully', imageUrl: fileUrl };
  } catch (error) {
    console.error('Error handling /upload request:', error);
    ctx.status = 500;
    ctx.body = { message: 'Internal server error' };
  }
});

// Apply routes
console.log('uploadDir:', uploadDir);
app.use(require('koa-static')(uploadDir));
app.use(router.routes());
app.use(router.allowedMethods());

// Start server
app.listen(port, () => {
  console.log(`Server running on http://127.0.0.1:${port}`);
});