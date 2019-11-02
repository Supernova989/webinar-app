import React, { useEffect, useRef, useState } from 'react';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-github";
import PropTypes from "prop-types";


export default function CodeEditor({onChange, data}) {
	return (
		
			<article>
				<AceEditor
					mode="html"
					theme="github"
					onChange={onChange}
					name="editor-window"
					width={'100%'}
					editorProps={{ $blockScrolling: true }}
				/>
			</article>
		
		
	);
};

CodeEditor.propTypes = {
	onChange: PropTypes.func.isRequired,
	data: PropTypes.string.isRequired
};
