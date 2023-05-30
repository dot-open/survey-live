export function imgBufferToB64(buffer: Buffer | string): string {
	// @ts-ignore
	return 'data:image/png;base64,' + Buffer.from(buffer, 'binary').toString('base64');
}

export function wait(ms: number) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(ms);
		}, ms);
	});
}