import React from 'react';

function BlogList(props) {
	
	const {articles} = props;
	
	return(
		<div>
			{articles && articles.map((article) => {
			
			})}
		</div>
	)
}
