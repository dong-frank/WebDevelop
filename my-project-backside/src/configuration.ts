import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as upload from '@midwayjs/upload';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as serve from 'koa-static';
import * as crossDomain from '@midwayjs/cross-domain';
import { join } from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';

@Configuration({
  imports: [
    koa,
    validate,
    crossDomain,
    upload,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    const staticDir = join(__dirname, './server/uploads');
    this.app.use(serve(staticDir));
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
