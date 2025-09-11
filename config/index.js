require('dotenv').config({ path: './config/test.env' });

module.exports = {
    projectPath: 'D:\\gitlab\\miniprogram',
    cliPath: 'E:\\wechatTools\\cli.bat',
    port: 61759,
    timeout: 15000, // 默认超时时间
    reporter: 'mochawesome' // 测试报告格式
};
