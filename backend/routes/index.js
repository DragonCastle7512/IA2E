const viewRouter = require('./view.route');
const apiRouter = require('./api.route');

module.exports = (app) => {
    /* 프론트 서빙 */
    app.use('/', viewRouter);
    /* 백엔드 API 호출 */
    app.use('/api', apiRouter);
};