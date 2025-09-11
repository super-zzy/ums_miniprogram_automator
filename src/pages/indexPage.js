const AutomatorActions = require('../automator/actions');

// 确保类定义正确，方法都在类内部
class IndexPage {
    constructor() {
        this.actions = new AutomatorActions();
    }

    /**
     * 初始化页面
     * @param {string} projectPath - 项目路径
     * @returns {Promise<IndexPage>}
     */
    async init(projectPath) {
        await this.actions.init(projectPath);
        return this;
    }

    /**
     * 打开首页
     * @returns {Promise<IndexPage>}
     */
    async open() {
        await this.actions.navigateTo('/pages/index/index');
        return this;
    }

    /**
     * 获取页面标题
     * @returns {Promise<string>}
     */
    async getTitle() {
        // 请根据实际页面调整选择器
        return await this.actions.getElementText('#pageTitle');
    }

    /**
     * 执行搜索
     * @param {string} keyword - 搜索关键词
     * @returns {Promise<IndexPage>}
     */
    async search(keyword) {
        await this.actions
            .inputText('#search-input', keyword)
            .click('#search-button');
        return this;
    }

    /**
     * 获取搜索结果
     * @returns {Promise<string>}
     */
    async getSearchResult() {
        return await this.actions.getElementText('.search-result');
    }

    /**
     * 关闭页面
     * @returns {Promise<void>}
     */
    async close() {
        await this.actions.close();
    }
}

// 确保正确导出类
module.exports = IndexPage;
