import { Converter } from './converter';

describe('converter.ts', () => {
	test('input', () => {
		const pictureBuffer = Buffer.from(
			'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
			'base64',
		);

		const user = {
			id: 575,
			name: 'Danny',
			favorites: ['apples', 'pears'],
			lastPayment: null,
			createdAt: new Date('2021-07-09T21:44:07.015Z'),
			address: {
				streetNumber: 112,
				streetName: 'Drive',
			},
			profilePicture: pictureBuffer,
		};

		const userObject = Converter.marshall(user);

		expect(userObject).toEqual({
			id: { N: '575' },
			name: { S: 'Danny' },
			favorites: { L: [{ S: 'apples' }, { S: 'pears' }] },
			lastPayment: { NULL: true },
			createdAt: { S: '2021-07-09T21:44:07.015Z' },
			address: {
				M: { streetNumber: { N: '112' }, streetName: { S: 'Drive' } },
			},
			profilePicture: {
				B: pictureBuffer,
			},
		});

		const unmarshalled = Converter.unmarshall(userObject);

		const stringDateUser = {
			...user,
			createdAt: '2021-07-09T21:44:07.015Z',
		};

		expect(unmarshalled).toEqual(stringDateUser);
	});
});
