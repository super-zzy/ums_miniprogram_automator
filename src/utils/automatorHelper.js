const automator = require('miniprogram-automator');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const config = require('../../config')
const { exec } = require('child_process'); // 引入child_process模块
const { promisify } = require('util');
const execAsync = promisify(exec); // 转为Promise形式，方便async/await使用

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
        const baseConfig = config

        // 可以在这里添加从配置文件加载的逻辑
        return baseConfig;
    }

    /**
     * 从微信开发者工具配置文件获取当前服务端口
     */
    getDeveloperToolPort() {
        // Windows配置文件路径（根据实际系统修改）
        const configPath = path.join(
            process.env.APPDATA,
            'Tencent',
            '微信web开发者工具',
            'Default',
            'config.json'
        );

        try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            return config.serverPort; // 默认端口作为 fallback
        } catch (error) {
            console.warn('获取端口失败，使用默认端口', error.message);
            return 9420;
        }
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
            // this.validateConfig();

            // 使用配置的CLI路径启动
            execSync(`${this.config.cliPath} --project ${this.config.projectPath} --auto ${this.config.port}`, {
                stdio: 'ignore',
                detached: true
            });
            await new Promise(resolve => setTimeout(resolve, 30000)); // 等待启动完成
        } catch (e) {
            throw new Error(`启动微信开发者工具失败: ${e.message}`);
        }
    }

    // 初始化自动化环境
    async init() {
        const maxRetries = 5; // 最大重试次数
        const retryDelay = 3000; // 重试间隔（毫秒）
        let retryCount = 0;

        // 先关闭旧连接
        if (this.miniprogram) {
            await this.miniprogram.close().catch(() => {});
        }

        try {
            // this.validateConfig();
            await this.closeDevTools();
            // await this.startDevTools();

            // 1. 构建命令行：cli auto --project [路径] --auto-port [端口]
            const command = `"${this.config.cliPath}" auto --project "${this.config.projectPath}" --auto-port ${this.config.port}`;
            console.log('执行启动命令:', command);

            // 2. 执行命令行（超时时间设为10秒）
            const { stdout, stderr } = await execAsync(command, { timeout: 10000 });

            // 3. 处理命令输出
            if (stderr) {
                console.warn('命令执行警告:', stderr);
            }
            console.log('开发者工具启动成功:', stdout);


            // 重试连接逻辑
            while (retryCount < maxRetries) {
                const currentAttempt = retryCount + 1; // 将变量定义在循环内，确保try/catch都能访问
                try {
                    console.log(`正在尝试第 ${currentAttempt}/${maxRetries} 次连接...`);
                    // 连接小程序（使用wsEndpoint）
                    this.miniprogram = await automator.connect({
                        wsEndpoint: this.config.wsEndpoint
                    });

                    console.log('小程序自动化环境初始化成功');
                    return this.miniprogram;

                } catch (connectError) {
                    retryCount++;
                    // 如果达到最大重试次数则抛出错误
                    if (retryCount >= maxRetries) {
                        console.error(`超过最大重试次数(${maxRetries})，连接失败:`, connectError.message);
                        throw connectError;
                    }

                    // 否则等待延迟后继续重试
                    console.log(`第 ${currentAttempt} 次连接失败，${retryDelay / 1000}秒后重试...`);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                }
            }
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
