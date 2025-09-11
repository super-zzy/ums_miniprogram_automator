require('dotenv').config({ path: './config/test.env' });

module.exports = {
    projectPath: process.env.PROJECT_PATH || 'D:\\gitlab\\miniprogram',
    cliPath: process.env.CLI_PATH || 'C:\\Program Files (x86)\\Tencent\\微信web开发者工具',
    port: process.env.PORT || 26042,
    timeout: 15000, // 默认超时时间
    reporter: 'mochawesome' // 测试报告格式
};
