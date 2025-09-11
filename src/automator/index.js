const automator = require('miniprogram-automator');
const config = require('../../config');
const logger = require('../utils/logger');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

class Automator {
    constructor() {
        this.instance = null;
        this.page = null;
    }

    /**
     * 初始化小程序自动化环境（命令行方式）
     */
    async init() {
        try {
            // 1. 检查微信开发者工具是否已启动，若已启动则关闭
            console.log('检查并关闭已运行的微信开发者工具...');
            try {
                // Windows系统关闭命令（根据实际系统调整）
                await execAsync('taskkill /f /im 微信web开发者工具.exe', { windowsHide: true });
            } catch (err) {
                // 未运行时会报错，属于正常情况
                console.log('微信开发者工具未在运行');
            }

            // 2. 命令行启动微信开发者工具并开启自动化端口
            console.log('启动微信开发者工具...');
            const startCommand = `"${this.config.cliPath}" open --project "${this.config.projectPath}" --port ${this.config.port}`;
            console.log('执行命令:', startCommand);
            await execAsync(startCommand, { windowsHide: true });

            // 3. 等待开发者工具启动完成（根据实际情况调整等待时间）
            console.log('等待开发者工具初始化...');
            await new Promise(resolve => setTimeout(resolve, 5000));

            // 4. 连接小程序自动化环境
            console.log('连接小程序自动化环境...');
            this.miniprogram = await automator.connect({
                projectPath: this.config.projectPath,
                port: this.config.port
            });

            console.log('小程序自动化环境初始化成功');
            return this.miniprogram;
        } catch (error) {
            console.error('小程序自动化环境初始化失败:', error.message);
            throw error;
        }
    }

    // 打开指定页面
    async openPage(pagePath, params = {}) {
        logger.info(`打开页面: ${pagePath}`);
        this.page = await this.instance.reLaunch(`/${pagePath}?${new URLSearchParams(params)}`);
        await this.page.waitFor(config.timeout); // 等待页面加载
        return this.page;
    }

    // 关闭自动化环境
    async close() {
        if (this.instance) {
            logger.info('关闭自动化环境...');
            await this.instance.close();
            logger.success('自动化环境已关闭');
        }
    }
}

module.exports = new Automator();
