require('dotenv').config({ path: './config/test.env' });

module.exports = {
    projectPath: 'D:\\gitlab\\miniprogram',
    cliPath: 'E:\\wechatTools\\cli.bat',
    port: 37977,
    timeout: 15000, // 默认超时时间
    reporter: 'mochawesome', // 测试报告格式
    wsEndpoint: 'ws://127.0.0.1:37977'
};
