// 测试环境配置文件
// 可根据实际环境修改配置值，优先级：环境变量 > 此文件配置

module.exports = {
    // 小程序项目根路径（必填）
    PROJECT_PATH: 'D:\\gitlab\\miniprogram\\app.json',

    // 微信开发者工具CLI路径（根据系统类型修改）
    // Windows默认路径示例：'C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat'
    // Mac默认路径示例：'/Applications/wechatwebdevtools.app/Contents/MacOS/cli'
    CLI_PATH: 'C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat',

    // 开发者工具端口（默认9420，需与开发者工具设置一致）
    PORT: 38926,

    // 测试超时时间（毫秒）
    TIMEOUT: 15000,

    // 是否启用调试模式（true时输出详细日志）
    DEBUG_MODE: false
};
