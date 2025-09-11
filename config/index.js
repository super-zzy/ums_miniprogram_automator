require('dotenv').config({ path: './config/test.env' });

module.exports = {
    projectPath: process.env.PROJECT_PATH || 'D:\\gitlab\\miniprogram',
    cliPath: process.env.CLI_PATH || 'E:\\微信web开发者工具',
    port: process.env.PORT || 44606,
    timeout: 15000, // 默认超时时间
    reporter: 'mochawesome' // 测试报告格式
};
