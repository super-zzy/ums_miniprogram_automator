const logger = require('../utils/logger');
const { timeout } = require('../../config');

class Actions {
    constructor(page) {
        this.page = page;
    }

    // 查找元素（支持文本筛选）
    async findElement(selector, text = '') {
        logger.debug(`查找元素: ${selector} ${text ? `[文本: ${text}]` : ''}`);
        const elements = await this.page.$$(selector);
        if (text) {
            for (const el of elements) {
                const elText = await el.text();
                if (elText.includes(text)) {
                    return el;
                }
            }
            throw new Error(`未找到包含文本 "${text}" 的元素: ${selector}`);
        }
        if (elements.length === 0) {
            throw new Error(`未找到元素: ${selector}`);
        }
        return elements[0];
    }

    // 输入文本
    async inputText(selector, value) {
        const el = await this.findElement(selector);
        await el.input(value);
        logger.debug(`输入文本: ${selector} -> ${value}`);
    }

    // 点击元素
    async clickElement(selector, text = '') {
        const el = await this.findElement(selector, text);
        await el.tap();
        logger.debug(`点击元素: ${selector} ${text ? `[文本: ${text}]` : ''}`);
        await this.page.waitFor(500); // 点击后等待
    }
}

module.exports = Actions;
