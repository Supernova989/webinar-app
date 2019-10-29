module.exports = (...fields) => {
	return async context => {
		for (let field of fields) {
			delete context.data[field];
		}
		// default timestamps
		delete context.data['createdAt'];
		delete context.data['updatedAt'];
		
		return context;
	};
};
