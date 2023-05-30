import path from 'path';
import fs from 'fs';
export type ChartType = 'bar'|'pie';

export default interface SurveyConfig {
	tempFolder?: string;
	delay?: number;
	port?: number;
	chart?:ChartType;
}

export const defaultConfig: SurveyConfig = {
	tempFolder: path.join(process.env.TMP, 'survey-live-temp'),
	delay: 300,
	port: 4000,
	chart:'bar',
};

export function ensureConfig(config: SurveyConfig): SurveyConfig {
	let conf: SurveyConfig = config;
	if (!fs.existsSync(conf.tempFolder)) {
		try {
			fs.mkdirSync(conf.tempFolder);
		} catch (e) {
			conf.tempFolder = defaultConfig.tempFolder;
		}
	}
	if (typeof conf.delay !== 'number') {
		conf.delay = defaultConfig.delay;
	}
	return conf;
}
