export function randomize(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

export function ab2str(buffer: ArrayBuffer) {
    return new TextDecoder().decode(buffer);
    // return String.fromCharCode.apply(null, [...new Uint8Array(buffer as ArrayBuffer)]);
}

export function str2ab(text: string) {
    return new TextEncoder().encode(text);
    // return String.fromCharCode.apply(null, [...new Uint8Array(buffer as ArrayBuffer)]);
}

export function isMasterProcess() {
    return !process.env.NODE_APP_INSTANCE || process.env.NODE_APP_INSTANCE === "0";
}

export function delay(min: number, max: number) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, randomize(min, max), true);
    });
}