import { typeOf } from './types';

const memberTypeToSetType: Record<string, string> = {
	String: 'String',
	Number: 'Number',
	NumberValue: 'Number',
	Binary: 'Binary',
};

export class DynamoDBSet {
	values: any[] = [];
	wrapperName = 'Set';
	type?: string;

	constructor(list: any[]) {
		this.initialize(list);
	}

	initialize(list: any[]) {
		this.values.concat(...list);
		this.detectType();
	}

	detectType() {
		this.type = memberTypeToSetType[typeOf(this.values[0])];
		if (!this.type) {
			throw new Error('Sets can contain string, number, or binary values');
		}
	}

	/**
	 * Render the underlying values only when converting to JSON.
	 */
	toJSON() {
		return this.values;
	}
}
