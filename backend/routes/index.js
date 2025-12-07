const viewRouter = require('./view.route');
const apiRouter = require('./api.route');
const authenticateToken = require('../conf/auth');

module.exports = (app) => {
    /* 프론트 서빙 */
    app.use('/', authenticateToken, viewRouter);
    /* 백엔드 API 호출 */
    app.use('/api', authenticateToken, apiRouter);
};