import { Page } from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import {ChartType} from "./config";

export async function checkLoginState(page: Page): Promise<boolean> {
	try {
		await page.waitForSelector('text/登录腾讯文档', { timeout: 3000 });
		return false;
	} catch (e) {
		return true;
	}
}

export async function saveLoginCode(page: Page, path: string) {
	await page.click('text/登录腾讯文档');
	await page.waitForSelector("img[alt='微信登录二维码']");
	const loginImg = await page.$eval("img[alt='微信登录二维码']", (e: HTMLImageElement) => e.src);
	const loginBuf = Buffer.from(loginImg.replace(/^data:image\/\w+;base64,/, ''), 'base64');
	fs.writeFileSync(path, loginBuf);
}

export async function getChartTypeSelector(type:ChartType):Promise<string>{
	switch (type) {
		case "bar":
			return "text/条形图"
		case "pie":
		default:
			return "text/饼图"
	}
}