const viewRouter = require('./view.route');
const apiRouter = require('./api.route');
const errorRouter = require('./error.route');
const authenticateToken = require('../conf/auth');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: "너무 많은 요청을 보내셨어요. 잠시 후 다시 시도해주세요!",
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({ 
    windowMs: 10 * 60 * 1000, 
    max: 5,
    message: "로그인 시도가 너무 많습니다. 10분 뒤에 다시 시도해주세요."
});

module.exports = (app) => {
    /* 프론트 서빙 */
    app.use('/', authenticateToken, viewRouter);
    /* 별도의 limit */
    app.post('/api/login', loginLimiter);
    app.post('/api/signup', loginLimiter);
    /* 백엔드 API 호출 */
    app.use('/api', limiter, authenticateToken, apiRouter);
    /* 없으면 404 */
    app.use(errorRouter);
};