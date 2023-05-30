#! /usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import figlet from 'figlet';
import open from 'open';
import { launch } from 'puppeteer-core';
import { checkLoginState, saveLoginCode } from './browser';
import LiveServer from './live-server';
import fs from 'fs';
import { SurveyRefreshed } from './index';

console.log(figlet.textSync('survey-live'));

const program = new Command()
	.description('Live display for Tencent Survey')
	.argument('<id>', 'survey id')
	.option('-t, --temp <directory>', 'temp folder')
	.option('-d, --delay <ms>', 'refresh delay')
	.option('-e, --exec <path>', 'chromium path')
	.option('-s, --show', 'show chromium window')
	.parse(process.argv);

const args = program.args;

const options = program.opts();
console.log(options);

const survey = new SurveyRefreshed(args[0], {
	tempFolder: options.temp,
	delay: Number(options.delay),
})

process.on('SIGINT', () => {
	survey.stop().then(()=>{
		process.exit();
	})
});

(async () => {
	await survey.run({ executablePath: options.exec, headless: !options.show });
})();
