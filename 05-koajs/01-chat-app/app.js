const path = require('path');
const Koa = require('koa');
const cors = require('@koa/cors');
const app = new Koa();
app.use(cors());
app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let resolveArr = [];
router.get('/subscribe', async (ctx) => {
  const promise = new Promise((resolve) => {
    resolveArr.push(resolve);
  });
  const result = await promise;
  ctx.stats = 200;
  ctx.body = result;
});

router.post('/publish', async (ctx) => {
  if (!ctx.request.body.message || !toString(ctx.request.body.message).trim()) {
    return ctx.throw(422);
  }
  resolveArr.map((fn) => fn(ctx.request.body.message));
  resolveArr=[];
  ctx.status = 201;
});

app.use(router.routes());

module.exports = app;
