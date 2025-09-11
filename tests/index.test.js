const { expect } = require('chai');
const helper = require('../src/utils/automatorHelper'); // 根据实际路径调整
// const IndexPage = require('../src/pages/indexPage');
const logger = require('../src/utils/logger');

describe('首页测试', function() {
    this.timeout(60000); // 延长超时时间
    let indexPage;

    before(async () => {
        await helper.init();
        const page = await helper.openPage('pages/index/index');
        indexPage = new IndexPage(page);
    });

    it('页面标题应显示"首页"', async () => {
        const title = await indexPage.page.$eval('.title', el => el.textContent);
        expect(title).to.include('首页');
    });

    it('搜索功能应正常工作', async () => {
        await indexPage.search('测试商品');
        const result = await indexPage.page.$('.search-result');
        expect(result).to.exist; // 验证搜索结果存在
    });

    // after(async () => {
    //     await helper.close();
    // });
});
