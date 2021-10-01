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
    return ctx.stats = 422;
  }
  await resolveArr.map((fn) => fn(ctx.request.body.message));
  resolveArr=[];
  ctx.stats = 201;
  ctx.body = {a: 1};
});

app.use(router.routes());

module.exports = app;
