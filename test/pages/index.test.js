const helper = require('../../utils/automatorHelper');
const { expect } = require('chai');

// 首页测试套件
describe('首页（pages/index/index）自动化测试', function() {
    // 测试前初始化环境
    before(async function() {
        this.timeout(30000); // 延长超时时间（初始化可能耗时）
        await helper.init();
    });

    // 测试后关闭环境
    after(async function() {
        this.timeout(10000);
        await helper.close();
    });

    // 测试用例1：打开首页并验证页面标题
    it('打开首页应显示正确标题', async function() {
        this.timeout(15000);
        // 打开首页
        await helper.openPage('pages/index/index');

        // 验证页面标题（假设标题元素class为.page-title）
        const titleElement = await helper.findElement('.page-title');
        const titleText = await titleElement.text();
        expect(titleText).to.equal('首页', '首页标题显示错误');
    });

    // 测试用例2：输入框输入并验证
    it('输入框应支持文本输入', async function() {
        this.timeout(10000);
        // 假设输入框选择器为#search-input
        const inputSelector = '#search-input';
        const testText = '自动化测试';

        // 输入文本
        await helper.inputText(inputSelector, testText);

        // 再次验证输入结果（双重确认）
        const inputElement = await helper.findElement(inputSelector);
        const actualValue = await inputElement.value();
        expect(actualValue).to.equal(testText, '输入框内容验证失败');
    });

    // 测试用例3：点击按钮跳转页面
    it('点击"进入列表页"按钮应跳转到列表页', async function() {
        this.timeout(15000);
        // 点击跳转按钮（假设按钮文本为"进入列表页"）
        await helper.clickElement('.btn-go-list', '进入列表页');

        // 等待页面跳转并验证当前页面路径
        await helper.page.waitForReady();
        const currentPath = helper.page.path;
        expect(currentPath).to.equal('pages/list/list', '跳转列表页失败');
    });
});

