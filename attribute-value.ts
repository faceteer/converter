/**
 * <p>Represents the data for an attribute.</p>
 *         <p>Each attribute value is described as a name-value pair. The name is the data type, and
 *             the value is the data itself.</p>
 *         <p>For more information, see <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes">Data Types</a> in the <i>Amazon DynamoDB Developer
 *             Guide</i>.</p>
 */
export declare type AttributeValue =
	| AttributeValues.BMember
	| AttributeValues.BOOLMember
	| AttributeValues.BSMember
	| AttributeValues.LMember
	| AttributeValues.MMember
	| AttributeValues.NMember
	| AttributeValues.NSMember
	| AttributeValues.NULLMember
	| AttributeValues.SMember
	| AttributeValues.SSMember
	| AttributeValues.$UnknownMember;
export declare namespace AttributeValues {
	/**
	 * <p>An attribute of type String. For example:</p>
	 *         <p>
	 *             <code>"S": "Hello"</code>
	 *          </p>
	 */
	interface SMember {
		S: string;
		N?: never;
		B?: never;
		SS?: never;
		NS?: never;
		BS?: never;
		M?: never;
		L?: never;
		NULL?: never;
		BOOL?: never;
		$unknown?: never;
	}
	/**
	 * <p>An attribute of type Number. For example:</p>
	 *         <p>
	 *             <code>"N": "123.45"</code>
	 *          </p>
	 *         <p>Numbers are sent across the network to DynamoDB as strings, to maximize compatibility
	 *             across languages and libraries. However, DynamoDB treats them as number type attributes
	 *             for mathematical operations.</p>
	 */
	interface NMember {
		S?: never;
		N: string;
		B?: never;
		SS?: never;
		NS?: never;
		BS?: never;
		M?: never;
		L?: never;
		NULL?: never;
		BOOL?: never;
		$unknown?: never;
	}
	/**
	 * <p>An attribute of type Binary. For example:</p>
	 *         <p>
	 *             <code>"B": "dGhpcyB0ZXh0IGlzIGJhc2U2NC1lbmNvZGVk"</code>
	 *          </p>
	 */
	interface BMember {
		S?: never;
		N?: never;
		B: Uint8Array;
		SS?: never;
		NS?: never;
		BS?: never;
		M?: never;
		L?: never;
		NULL?: never;
		BOOL?: never;
		$unknown?: never;
	}
	/**
	 * <p>An attribute of type String Set. For example:</p>
	 *         <p>
	 *             <code>"SS": ["Giraffe", "Hippo" ,"Zebra"]</code>
	 *          </p>
	 */
	interface SSMember {
		S?: never;
		N?: never;
		B?: never;
		SS: string[];
		NS?: never;
		BS?: never;
		M?: never;
		L?: never;
		NULL?: never;
		BOOL?: never;
		$unknown?: never;
	}
	/**
	 * <p>An attribute of type Number Set. For example:</p>
	 *         <p>
	 *             <code>"NS": ["42.2", "-19", "7.5", "3.14"]</code>
	 *          </p>
	 *         <p>Numbers are sent across the network to DynamoDB as strings, to maximize compatibility
	 *             across languages and libraries. However, DynamoDB treats them as number type attributes
	 *             for mathematical operations.</p>
	 */
	interface NSMember {
		S?: never;
		N?: never;
		B?: never;
		SS?: never;
		NS: string[];
		BS?: never;
		M?: never;
		L?: never;
		NULL?: never;
		BOOL?: never;
		$unknown?: never;
	}
	/**
	 * <p>An attribute of type Binary Set. For example:</p>
	 *         <p>
	 *             <code>"BS": ["U3Vubnk=", "UmFpbnk=", "U25vd3k="]</code>
	 *          </p>
	 */
	interface BSMember {
		S?: never;
		N?: never;
		B?: never;
		SS?: never;
		NS?: never;
		BS: Uint8Array[];
		M?: never;
		L?: never;
		NULL?: never;
		BOOL?: never;
		$unknown?: never;
	}
	/**
	 * <p>An attribute of type Map. For example:</p>
	 *         <p>
	 *             <code>"M": {"Name": {"S": "Joe"}, "Age": {"N": "35"}}</code>
	 *          </p>
	 */
	interface MMember {
		S?: never;
		N?: never;
		B?: never;
		SS?: never;
		NS?: never;
		BS?: never;
		M: {
			[key: string]: AttributeValue;
		};
		L?: never;
		NULL?: never;
		BOOL?: never;
		$unknown?: never;
	}
	/**
	 * <p>An attribute of type List. For example:</p>
	 *         <p>
	 *             <code>"L": [ {"S": "Cookies"} , {"S": "Coffee"}, {"N", "3.14159"}]</code>
	 *          </p>
	 */
	interface LMember {
		S?: never;
		N?: never;
		B?: never;
		SS?: never;
		NS?: never;
		BS?: never;
		M?: never;
		L: AttributeValue[];
		NULL?: never;
		BOOL?: never;
		$unknown?: never;
	}
	/**
	 * <p>An attribute of type Null. For example:</p>
	 *         <p>
	 *             <code>"NULL": true</code>
	 *          </p>
	 */
	interface NULLMember {
		S?: never;
		N?: never;
		B?: never;
		SS?: never;
		NS?: never;
		BS?: never;
		M?: never;
		L?: never;
		NULL: boolean;
		BOOL?: never;
		$unknown?: never;
	}
	/**
	 * <p>An attribute of type Boolean. For example:</p>
	 *         <p>
	 *             <code>"BOOL": true</code>
	 *          </p>
	 */
	interface BOOLMember {
		S?: never;
		N?: never;
		B?: never;
		SS?: never;
		NS?: never;
		BS?: never;
		M?: never;
		L?: never;
		NULL?: never;
		BOOL: boolean;
		$unknown?: never;
	}
	interface $UnknownMember {
		S?: never;
		N?: never;
		B?: never;
		SS?: never;
		NS?: never;
		BS?: never;
		M?: never;
		L?: never;
		NULL?: never;
		BOOL?: never;
		$unknown: [string, any];
	}
	interface Visitor<T> {
		S: (value: string) => T;
		N: (value: string) => T;
		B: (value: Uint8Array) => T;
		SS: (value: string[]) => T;
		NS: (value: string[]) => T;
		BS: (value: Uint8Array[]) => T;
		M: (value: { [key: string]: AttributeValue }) => T;
		L: (value: AttributeValue[]) => T;
		NULL: (value: boolean) => T;
		BOOL: (value: boolean) => T;
		_: (name: string, value: any) => T;
	}
	const visit: <T>(value: AttributeValue, visitor: Visitor<T>) => T;
	/**
	 * @internal
	 */
	const filterSensitiveLog: (obj: AttributeValue) => any;
}

export type AttributeMap = { [key: string]: AttributeValue };
