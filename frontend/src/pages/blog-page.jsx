import React from 'react';
import { getService } from "../feathers-client";

function BlogPage(props) {
	
	const blog = getService('posts', 1);
	blog.find().then(res => console.log('==>', res));
	// messages.create({text: 'hello world'}).then(res => console.log('==>', res));
	return (
		<h1>Blog page</h1>
	)
}

export default BlogPage;
