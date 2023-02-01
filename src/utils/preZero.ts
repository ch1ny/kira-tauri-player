export const preZero = (str: string, zeroNum: number) => {
	if (str.length >= zeroNum) return str;

	return `${new Array(zeroNum - str.length).fill(0).join('')}${str}`;
};
