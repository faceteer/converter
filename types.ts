export function typeOf(data: any) {
	if (data instanceof Date) {
		return 'Date';
	}
	if (data === null && typeof data === 'object') {
		return 'null';
	} else if (data !== undefined && isBinary(data)) {
		return 'Binary';
	} else if (data !== undefined && data.constructor) {
		return data.wrapperName || typeName(data.constructor);
	} else if (data !== undefined && typeof data === 'object') {
		// this object is the result of Object.create(null), hence the absence of a
		// defined constructor
		return 'Object';
	} else {
		return 'undefined';
	}
}

function isBinary(data: any) {
	const types = [
		'Buffer',
		'File',
		'Blob',
		'ArrayBuffer',
		'DataView',
		'Int8Array',
		'Uint8Array',
		'Uint8ClampedArray',
		'Int16Array',
		'Uint16Array',
		'Int32Array',
		'Uint32Array',
		'Float32Array',
		'Float64Array',
	];
	if (Buffer.isBuffer(data)) {
		return true;
	}

	for (let i = 0; i < types.length; i++) {
		if (data !== undefined && data.constructor) {
			if (isType(data, types[i])) return true;
			if (typeName(data.constructor) === types[i]) return true;
		}
	}

	return false;
}

function typeName(type: any): string {
	if (Object.prototype.hasOwnProperty.call(type, 'name')) return type.name;
	const str = type.toString();
	const match = str.match(/^\s*function (.+)\(/);
	return match ? match[1] : str;
}

function isType(obj: any, type: string) {
	// handle cross-"frame" objects
	if (typeof type === 'function') type = typeName(type);
	return Object.prototype.toString.call(obj) === '[object ' + type + ']';
}
