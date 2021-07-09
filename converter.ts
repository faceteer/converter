import { getUnixTime } from 'date-fns';
import {
	AttributeMap,
	AttributeValue,
	BinaryAttributeValue,
} from './attribute-value';
import { ConverterOptions } from './converter-options';
import { DynamoDBSet } from './set';
import { typeOf } from './types';

export class Converter {
	/**
	 * Convert a JavaScript value to its equivalent DynamoDB AttributeValue type
	 *
	 * @param data [any] The data to convert to a DynamoDB AttributeValue
	 * @param options [map]
	 * @option options convertEmptyValues [Boolean] Whether to automatically
	 *                                              convert empty strings, blobs,
	 *                                              and sets to `null`
	 * @option options wrapNumbers [Boolean]  Whether to return numbers as a
	 *                                        NumberValue object instead of
	 *                                        converting them to native JavaScript
	 *                                        numbers. This allows for the safe
	 *                                        round-trip transport of numbers of
	 *                                        arbitrary size.
	 * @return [map] An object in the Amazon DynamoDB AttributeValue format
	 *
	 * @see Converter.marshall Converter.marshall to
	 *    convert entire records (rather than individual attributes)
	 */
	static input(data: any, options?: ConverterOptions): AttributeValue {
		options = options || {};
		const type = typeOf(data);
		if (type === 'Date') {
			return formatDate(data, options);
		}
		if (type === 'Object') {
			return formatMap(data, options);
		} else if (type === 'Array') {
			return formatList(data, options);
		} else if (type === 'Set') {
			return formatSet(data, options);
		} else if (type === 'String') {
			if (data.length === 0 && options.convertEmptyValues) {
				return this.input(null);
			}
			return { S: data };
		} else if (type === 'Number' || type === 'NumberValue') {
			return { N: data.toString() };
		} else if (type === 'Binary') {
			if (data.length === 0 && options.convertEmptyValues) {
				return this.input(null);
			}
			return { B: data };
		} else if (type === 'Boolean') {
			return { BOOL: data };
		} else if (type === 'null') {
			return { NULL: true };
		} else if (type !== 'undefined' && type !== 'Function') {
			// this value has a custom constructor
			return formatMap(data, options);
		}
		throw new Error(
			`Unable to convert property to a Dynamo DB attribute with type ${type}`,
		);
	}

	/**
	 * Convert a JavaScript object into a DynamoDB record.
	 *
	 * @param data [any] The data to convert to a DynamoDB record
	 * @param options [map]
	 * @option options convertEmptyValues [Boolean] Whether to automatically
	 *                                              convert empty strings, blobs,
	 *                                              and sets to `null`
	 * @option options wrapNumbers [Boolean]  Whether to return numbers as a
	 *                                        NumberValue object instead of
	 *                                        converting them to native JavaScript
	 *                                        numbers. This allows for the safe
	 *                                        round-trip transport of numbers of
	 *                                        arbitrary size.
	 *
	 * @return [map] An object in the DynamoDB record format.
	 *
	 * @example Convert a JavaScript object into a DynamoDB record
	 *  var marshalled = Converter.marshall({
	 *    string: 'foo',
	 *    list: ['fizz', 'buzz', 'pop'],
	 *    map: {
	 *      nestedMap: {
	 *        key: 'value',
	 *      }
	 *    },
	 *    number: 123,
	 *    nullValue: null,
	 *    boolValue: true,
	 *    stringSet: new DynamoDBSet(['foo', 'bar', 'baz'])
	 *  });
	 */
	static marshall(data: Record<string, any>, options?: ConverterOptions) {
		return this.input(data, options).M;
	}

	/**
	 * Convert a DynamoDB AttributeValue object to its equivalent JavaScript type.
	 *
	 * @param data [map] An object in the Amazon DynamoDB AttributeValue format
	 * @param options [map]
	 * @option options convertEmptyValues [Boolean] Whether to automatically
	 *                                              convert empty strings, blobs,
	 *                                              and sets to `null`
	 * @option options wrapNumbers [Boolean]  Whether to return numbers as a
	 *                                        NumberValue object instead of
	 *                                        converting them to native JavaScript
	 *                                        numbers. This allows for the safe
	 *                                        round-trip transport of numbers of
	 *                                        arbitrary size.
	 *
	 * @return [Object|Array|String|Number|Boolean|null]
	 *
	 * @see Converter.unmarshall Converter.unmarshall to
	 *    convert entire records (rather than individual attributes)
	 */
	static output(data: AttributeValue, options?: ConverterOptions): any {
		options = options || {};
		let list;
		let map: Record<string, any>;
		let i;
		for (const type in data) {
			if (!Object.prototype.hasOwnProperty.call(data, type)) {
				continue;
			}
			const key = type as keyof AttributeValue;

			if (key === 'M') {
				map = {};
				const mapValues = data[key] ?? {};
				for (const mapKey in mapValues) {
					if (!Object.prototype.hasOwnProperty.call(data, type)) {
						continue;
					}
					map[mapKey] = this.output(mapValues[mapKey], options);
				}
				return map;
			} else if (key === 'L') {
				list = [];
				const listValues = data[key] ?? [];
				for (i = 0; i < listValues.length; i++) {
					list.push(this.output(listValues[i], options));
				}
				return list;
			} else if (key === 'SS') {
				list = [];
				const listValues = data[key] ?? [];
				for (i = 0; i < listValues.length; i++) {
					list.push(listValues[i] + '');
				}
				return new DynamoDBSet(list);
			} else if (key === 'NS') {
				list = [];
				const listValues = data[key] ?? [];
				for (i = 0; i < listValues.length; i++) {
					list.push(convertNumber(listValues[i], options.wrapNumbers));
				}
				return new DynamoDBSet(list);
			} else if (key === 'BS') {
				list = [];
				const listValues = data[key] ?? [];
				for (i = 0; i < listValues.length; i++) {
					list.push(toBuffer(listValues[i]));
				}
				return new DynamoDBSet(list);
			} else if (key === 'S') {
				return `${data[key]}`;
			} else if (key === 'N') {
				const numberString = data[key];
				if (!numberString) {
					return null;
				}
				return convertNumber(numberString, options.wrapNumbers);
			} else if (key === 'B') {
				return toBuffer(data[key]);
			} else if (key === 'BOOL') {
				const boolString = `${data[key]}`;
				return (
					boolString === 'true' || boolString === 'TRUE' || data[key] === true
				);
			} else if (key === 'NULL') {
				return null;
			}
		}
	}

	/**
	 * Convert a DynamoDB record into a JavaScript object.
	 *
	 * @param data [any] The DynamoDB record
	 * @param options [map]
	 * @option options convertEmptyValues [Boolean] Whether to automatically
	 *                                              convert empty strings, blobs,
	 *                                              and sets to `null`
	 * @option options wrapNumbers [Boolean]  Whether to return numbers as a
	 *                                        NumberValue object instead of
	 *                                        converting them to native JavaScript
	 *                                        numbers. This allows for the safe
	 *                                        round-trip transport of numbers of
	 *                                        arbitrary size.
	 *
	 * @return [map] An object whose properties have been converted from
	 *    DynamoDB's AttributeValue format into their corresponding native
	 *    JavaScript types.
	 *
	 * @example Convert a record received from a DynamoDB stream
	 *  var unmarshalled = Converter.unmarshall({
	 *    string: {S: 'foo'},
	 *    list: {L: [{S: 'fizz'}, {S: 'buzz'}, {S: 'pop'}]},
	 *    map: {
	 *      M: {
	 *        nestedMap: {
	 *          M: {
	 *            key: {S: 'value'}
	 *          }
	 *        }
	 *      }
	 *    },
	 *    number: {N: '123'},
	 *    nullValue: {NULL: true},
	 *    boolValue: {BOOL: true}
	 *  });
	 */
	static unmarshall(data: AttributeMap, options?: ConverterOptions) {
		return this.output({ M: data }, options);
	}
}

/**
 * @api private
 * @param data [Array]
 * @param options [map]
 */
function formatList(data: any[], options?: ConverterOptions) {
	const list: { L: any[] } = { L: [] };
	for (let i = 0; i < data.length; i++) {
		list['L'].push(Converter.input(data[i], options));
	}
	return list;
}

/**
 * @api private
 * @param data [Array]
 * @param options [map]
 */
function formatDate(data: Date, options: ConverterOptions = {}) {
	if (options.dateFormat === 'unix') {
		return {
			S: `${getUnixTime(data)}`,
		};
	} else {
		return {
			S: data.toISOString(),
		};
	}
}

/**
 * @api private
 * @param value [String]
 * @param wrapNumbers [Boolean]
 */
function convertNumber(value: string, wrapNumbers?: boolean) {
	return wrapNumbers ? new NumberValue(value) : Number(value);
}

/**
 * @api private
 * @param data [map]
 * @param options [map]
 */
function formatMap(data: Record<string, any>, options?: ConverterOptions) {
	const map: { M: Record<string, any> } = { M: {} };
	for (const key in data) {
		if (!Object.prototype.hasOwnProperty.call(data, key)) {
			continue;
		}
		const formatted = Converter.input(data[key], options);
		if (formatted !== void 0) {
			map['M'][key] = formatted;
		}
	}
	return map;
}

/**
 * @api private
 */
function formatSet(data: any, options?: ConverterOptions) {
	options = options || {};
	let values = data.values;
	if (options.convertEmptyValues) {
		values = filterEmptySetValues(data);
		if (values.length === 0) {
			return Converter.input(null);
		}
	}

	const map: Record<string, any> = {};
	switch (data.type) {
		case 'String':
			map['SS'] = values;
			break;
		case 'Binary':
			map['BS'] = values;
			break;
		case 'Number':
			map['NS'] = values.map(function (value: number) {
				return value.toString();
			});
	}
	return map;
}

function toBuffer(value?: BinaryAttributeValue): Buffer | Uint8Array {
	if (!value) {
		return Buffer.from('');
	}
	if (value instanceof Buffer || value instanceof Uint8Array) {
		return value;
	}
	return Buffer.from(value);
}

/**
 * @api private
 */
function filterEmptySetValues(set: any) {
	const nonEmptyValues = [];
	const potentiallyEmptyTypes: Record<string, any> = {
		String: true,
		Binary: true,
		Number: false,
	};
	if (potentiallyEmptyTypes[set.type]) {
		for (let i = 0; i < set.values.length; i++) {
			if (set.values[i].length === 0) {
				continue;
			}
			nonEmptyValues.push(set.values[i]);
		}

		return nonEmptyValues;
	}

	return set.values;
}

class NumberValue {
	private value: number | string;

	constructor(value: number | string) {
		this.value = value;
	}

	/**
	 * Render the underlying value as a number when converting to JSON.
	 */
	toJSON() {
		return this.toNumber();
	}

	/**
	 * Convert the underlying value to a JavaScript number.
	 */
	toNumber() {
		return Number(this.value);
	}

	/**
	 * Return a string representing the unaltered value provided to the
	 * constructor.
	 */
	toString() {
		return this.value;
	}
}
