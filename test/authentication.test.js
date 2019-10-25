const app = require('../src/app');
const {ERROR_EMAIL_NOT_CONFIRMED} = require('../src/dictionary');

describe('authentication', () => {
	
	it('registered the authentication service', () => {
		expect(app.service('authentication')).toBeTruthy();
	});
	
	describe('local strategy', () => {
		const userInfo = {
			email: 'someone@example.com',
			password: 'supersecret',
			confirm: 'supersecret',
			firstName: 'John',
			lastName: 'Doe1',
			username: 'JohnDoe102',
		};
		
		beforeAll(async () => {
			try {
				await app.setup();
				await app.service('api/v1/users').create(userInfo);
			} catch (error) {
				// Do nothing, it just means the user already exists and can be tested
			}
		});
		
		it('Should return an error without Email address confirmed', async () => {
			let error;
			try {
				await app.service('authentication').create({
					strategy: 'local',
					...userInfo
				});
			}
			catch (e) {
				error = e;
			}
			expect(error).toBeTruthy();
			expect(error.message).toBe(ERROR_EMAIL_NOT_CONFIRMED);
			expect(error.code).toBe(401);
			expect(error.name).toBe('NotAuthenticated');
		});
		
		xit('authenticates user and creates accessToken', async () => {
			const {user, accessToken} = await app.service('authentication').create({
				strategy: 'local',
				...userInfo
			});
			
			expect(accessToken).toBeTruthy();
			expect(user).toBeTruthy();
		});
		
	});
});
