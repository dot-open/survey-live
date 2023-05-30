import 'mdui/dist/css/mdui.min.css';
import { io } from 'socket.io-client';

const appBar = document.querySelector('#appbar') as HTMLDivElement;
const expandButton = document.querySelector('#expand-button') as HTMLAnchorElement;
const minimizeButton = document.querySelector('#minimize-button') as HTMLAnchorElement;
const surveyImg = document.querySelector('#survey-img') as HTMLImageElement;
const socket = io();

expandButton.onclick = () => {
	appBar.dataset.expand = 'true';
};
minimizeButton.onclick = () => {
	appBar.dataset.expand = 'false';
};

socket.on('update', (src) => {
	surveyImg.src = src;
});
