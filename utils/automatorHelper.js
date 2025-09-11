const automator = require('miniprogram-automator');
const { expect } = require('chai');


/**
 * 小程序自动化测试工具类
 */
class AutomatorHelper {
    constructor() {
        this.miniprogram = null; // 小程序实例
        this.page = null; // 当前页面实例
        // 小程序基础配置（根据实际项目修改）
        this.config = {
            projectPath: 'D:\\gitlab\\miniprogram\\app.json', // 小程序项目根路径
            cliPath: 'C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat', // 微信开发者工具CLI路径（Windows需修改）
            port: 9420 // 开发者工具端口
        };
    }

    /**
     * 初始化小程序自动化环境
     */
    async init() {
        try {
            // 启动微信开发者工具
            await automator.launch({
                cliPath: this.config.cliPath,
                projectPath: this.config.projectPath,
                port: this.config.port
            });

            // 连接小程序
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

    /**
     * 打开指定页面
     * @param {string} pagePath 页面路径（如：pages/index/index）
     * @param {object} params 页面参数（可选）
     */
    async openPage(pagePath, params = {}) {
        try {
            this.page = await this.miniprogram.reLaunch(`/${pagePath}?${this.formatParams(params)}`);
            await this.page.waitForReady(); // 等待页面就绪
            console.log(`成功打开页面: ${pagePath}`);
            return this.page;
        } catch (error) {
            console.error(`打开页面${pagePath}失败:', error.message`);
            throw error;
        }
    }

    /**
     * 格式化页面参数（对象转URL参数）
     * @param {object} params 参数对象
     * @returns {string} URL参数字符串
     */
    formatParams(params) {
        return Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
    }

    /**
     * 查找元素并验证是否存在
     * @param {string} selector 元素选择器（如：.btn-submit, #input-name）
     * @param {string} text 元素文本（可选，用于精确匹配）
     */
    async findElement(selector, text = '') {
        let element;
        try {
            if (text) {
                element = await this.page.$(`${selector}:contains(${text})`);
            } else {
                element = await this.page.$(selector);
            }

            // 修正括号和断言方式
            expect(element).to.exist, `元素 ${selector}（文本: ${text}）未找到`;
            console.log(`成功找到元素: ${selector}（文本: ${text}）`);
            return element;
        } catch (error) {
            console.error(`查找元素失败:`, error.message); // 这里也修正了引号的语法错误
            throw error;
        }
    }

    /**
     * 输入框输入内容
     * @param {string} selector 输入框选择器
     * @param {string} value 输入内容
     */
    async inputText(selector, value) {
        try {
            const input = await this.findElement(selector);
            await input.input(value);
            // 验证输入结果
            const inputValue = await input.value();
            expect(inputValue).to.equal(value, `输入内容不匹配，预期: ${value}，实际: ${inputValue}`);
            console.log(`输入框 ${selector} 成功输入: ${value}`);
        } catch (error) {
            console.error(`输入框输入失败:', error.message`);
            throw error;
        }
    }

    /**
     * 点击元素
     * @param {string} selector 元素选择器
     * @param {string} text 元素文本（可选）
     */
    async clickElement(selector, text = '') {
        try {
            const element = await this.findElement(selector, text);
            await element.tap();
            console.log(`成功点击元素: ${selector}（文本: ${text}）`);
        } catch (error) {
            console.error(`元素点击失败:', error.message`);
            throw error;
        }
    }

    /**
     * 关闭小程序自动化环境
     */
    async close() {
        try {
            if (this.miniprogram) {
                await this.miniprogram.close();
            }
            // 移除 automator.close() 调用，改用以下方式
            console.log('小程序自动化环境已关闭');
        } catch (error) {
            console.error('关闭自动化环境失败:', error.message);
            throw error;
        }
    }
}

module.exports = new AutomatorHelper();

