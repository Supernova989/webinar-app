module.exports = (paths = []) => {
	return context => {
		if (paths.includes(context.path)) {
			return false;
		} else return !(paths.includes('internal') && !context.params.provider);
	};
};
