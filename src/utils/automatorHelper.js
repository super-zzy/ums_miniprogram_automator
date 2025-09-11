const automator = require('miniprogram-automator');
const { execSync } = require('child_process');
const fs = require('fs');

class AutomatorHelper {
    constructor() {
        // 确保配置对象在构造函数中被正确初始化
        this.config = this.loadConfig();
        this.miniprogram = null;
        this.page = null;
    }

    // 加载配置，确保配置存在
    loadConfig() {
        // 基础配置
        const baseConfig = {
            projectPath: 'D:\\gitlab\\miniprogram', // 例如: 'C:\\projects\\my-miniprogram'
            cliPath: 'E:\\微信web开发者工具\\cli.bat', // 自动获取默认路径
            port: 44606
        };

        // 可以在这里添加从配置文件加载的逻辑
        return baseConfig;
    }

    // 检查配置是否完整
    validateConfig() {
        if (!this.config) {
            throw new Error('配置对象未初始化');
        }
        if (!this.config.projectPath) {
            throw new Error('请配置小程序项目路径(projectPath)');
        }
        if (!this.config.cliPath || !fs.existsSync(this.config.cliPath)) {
            throw new Error(`微信开发者工具CLI路径不存在: ${this.config.cliPath}`);
        }
        if (!this.config.port) {
            throw new Error('请配置服务端口(port)');
        }
    }

    // 关闭已运行的开发者工具
    async closeDevTools() {
        try {
            console.log('检查并关闭已运行的微信开发者工具...');
            if (process.platform === 'win32') {
                execSync('taskkill /F /IM wechatdevtools.exe /T', { stdio: 'ignore' });
            } else {
                execSync('pkill -f wechatwebdevtools', { stdio: 'ignore' });
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e) {
            console.log('微信开发者工具未在运行');
        }
    }

    // 启动开发者工具
    async startDevTools() {
        try {
            console.log('启动微信开发者工具...');
            this.validateConfig();

            // 使用配置的CLI路径启动
            execSync(`${this.config.cliPath} --project ${this.config.projectPath} --auto ${this.config.port}`, {
                stdio: 'ignore',
                detached: true
            });
            await new Promise(resolve => setTimeout(resolve, 3000)); // 等待启动完成
        } catch (e) {
            throw new Error(`启动微信开发者工具失败: ${e.message}`);
        }
    }

    // 初始化自动化环境
    async init() {
        try {
            this.validateConfig();
            await this.closeDevTools();
            await this.startDevTools();

            this.miniprogram = await automator.connect({
                projectPath: this.config.projectPath,
                port: this.config.port
            });

            return this.miniprogram;
        } catch (e) {
            throw new Error(`小程序自动化环境初始化失败: ${e.message}`);
        }
    }

    // 其他辅助方法...
    async openPage(pagePath, params = {}) {
        this.page = await this.miniprogram.reLaunch(`/${pagePath}`);
        await this.page.waitFor();
        return this.page;
    }

    async findElement(selector, text) {
        const elements = await this.page.$$(selector);
        for (const el of elements) {
            const content = await el.text();
            if (content.includes(text)) {
                return el;
            }
        }
        return null;
    }

    // 关闭自动化环境
    async close() {
        if (this.miniprogram) {
            await this.miniprogram.close();
        }
        await this.closeDevTools();
    }
}

// 导出单例实例，确保配置只加载一次
module.exports = new AutomatorHelper();
