const Actions = require('../automator/actions');

class IndexPage {
    constructor(page) {
        this.actions = new Actions(page);
        this.page = page;
    }

    // 点击跳转详情页
    async goToDetail(id) {
        await this.actions.clickElement(`.detail-btn[data-id="${id}"]`);
        // 等待页面跳转完成
        await this.page.waitForNavigation();
    }

    // 搜索功能
    async search(keyword) {
        await this.actions.inputText('.search-input', keyword);
        await this.actions.clickElement('.search-btn', '搜索');
    }
}

module.exports = IndexPage;
