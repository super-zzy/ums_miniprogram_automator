const automator = require('miniprogram-automator');
const config = require('../../config');
const logger = require('../utils/logger');

class Automator {
    constructor() {
        this.instance = null;
        this.page = null;
    }

    // 初始化自动化环境
    async init() {
        logger.info('初始化微信小程序自动化环境...');
        this.instance = await automator.launch({
            projectPath: config.projectPath,
            cliPath: config.cliPath,
            port: config.port
        });
        logger.success('自动化环境初始化完成');
        return this.instance;
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
