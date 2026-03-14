const viewRouter = require('./view.route');
const apiRouter = require('./api.route');
const errorRouter = require('./error.route');
const authenticateToken = require('../conf/auth');
const path = require('path');

module.exports = (app) => {
    /* 프론트 서빙 */
    app.use('/', authenticateToken, viewRouter);
    /* 백엔드 API 호출 */
    app.use('/api', authenticateToken, apiRouter);
    /* 없으면 404 */
    app.use(errorRouter);
};