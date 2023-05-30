import SurveyConfig, { ensureConfig, defaultConfig } from './config';
import { Browser, launch, Page, PuppeteerLaunchOptions } from 'puppeteer-core';
import {checkLoginState, getChartTypeSelector, saveLoginCode} from './browser';
import open from 'open';
import path from 'path';
import { wait, imgBufferToB64 } from './utils';
import LiveServer from './live-server';
export class SurveyRefreshed {
	surveyId: string;
	config: SurveyConfig;
	private browser: Browser = null;
	private page: Page = null;
	private server: LiveServer = null;
	constructor(surveyId: string, config: SurveyConfig = defaultConfig) {
		this.surveyId = surveyId;
		this.config = ensureConfig({ ...defaultConfig, ...config });
	}
	private async refresh() {
		const sel = await getChartTypeSelector(this.config.chart)
		try {
			await this.page.click('text/统计');
			await this.page.click('text/数据汇总');
			await this.page.waitForSelector('.result-summary-item');
			await this.page.$eval('.result-form-root', (e) => {
				e.scrollTo(0, 322);
			});
			await this.page.click(".chart-type-content");
			await this.page.waitForSelector(sel);
			await wait(300);
			await this.page.$eval(sel,(e:HTMLElement)=>{
				e.click()
			})
			const statsList = await this.page.$(".form-statistics-list")
			//await this.page.setViewport({...this.page.viewport(), height:(await statsList.boundingBox()).height})
			await wait(1000);
			//this.server.update(imgBufferToB64(await this.page.screenshot({ fullPage: false })));
			this.server.update(imgBufferToB64(await statsList.screenshot({omitBackground:true})))
			await this.page.click('text/已填写');
		} catch (e) {
			console.error((e as Error).message);
		}
	}
	private regPageEvents() {
		this.page.on('load', async () => {
			//server.start()
			try {
				console.log('page loaded');
				console.log(`final url: ${this.page.url()}`);
				if (!(await checkLoginState(this.page))) {
					const p = path.join(this.config.tempFolder, 'tclogin.png');
					await saveLoginCode(this.page, p);
					console.log(`login qrcode saved to ${p}`);
					await open(p);
				} else {
					console.log(`start refreshing here i guess`);
					await open('http://localhost:' + this.config.port);
					while (this.page != null) {
						await this.refresh();
						await wait(this.config.delay);
					}
				}
			} catch (e) {
				await this.stop();
				throw e;
			}
		});
	}
	async run(options?: PuppeteerLaunchOptions) {
		if (this.browser != null) throw new Error('Browser is running');
		console.log(this.config);
		this.server = new LiveServer(this.config.port);
		this.server.start();
		this.browser = await launch({
			headless: true,
			args: ['--no-sandbox', '--force-device-scale-factor'],
			defaultViewport: { width: 1280, height: 720,deviceScaleFactor:1.5 },
			...options,
		});
		this.page = await this.browser.newPage();
		this.regPageEvents();
		try {
			await this.page.goto('https://docs.qq.com/form/page/' + this.surveyId, {
				waitUntil: 'networkidle0',
			});
		} catch (e) {
			await this.stop();
			throw e;
		}
	}
	async stop() {
		if (this.server != null) this.server.stop();
		this.server = null;
		if (this.browser != null) await this.browser.close();
		this.browser = null;
		this.page = null;
	}
}
