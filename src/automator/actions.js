const automator = require('miniprogram-automator');
const helper = require('../utils/automatorHelper');

class AutomatorActions {
    constructor() {
        this.page = null;
        this.app = null;
    }

    async init(projectPath) {
        this.app = await automator.launch({
            projectPath
        });
        return this;
    }

    async navigateTo(pagePath) {
        if (!this.app) {
            throw new Error('请先初始化小程序: call init() first');
        }

        this.page = await this.app.navigateTo(pagePath);
        await this.page.waitFor(500);
        return this;
    }

    // 确保inputText方法正确实现
    async inputText(selector, text) {
        if (!this.page) {
            throw new Error('请先导航到页面: call navigateTo() first');
        }

        const element = await this.page.$(selector);
        if (!element) {
            throw new Error(`未找到输入框元素: ${selector}`);
        }

        await element.input(text);
        return this;
    }

    async click(selector) {
        if (!this.page) {
            throw new Error('请先导航到页面: call navigateTo() first');
        }

        const element = await this.page.$(selector);
        if (!element) {
            throw new Error(`未找到元素: ${selector}`);
        }

        await element.tap();
        return this;
    }

    async getElementText(selector) {
        if (!this.page) {
            throw new Error('请先导航到页面: call navigateTo() first');
        }

        return await this.page.$eval(selector, el => el.textContent);
    }

    async close() {
        if (this.app) {
            await this.app.close();
        }
    }
}

module.exports = AutomatorActions;
