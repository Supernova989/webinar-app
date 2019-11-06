import GridLoader from "react-spinners/GridLoader";
import { css } from "@emotion/core";
import React from "react";

export function LoaderSpinner() {
	return (
		<div className='content-loader'>
			<GridLoader css={css`display: block;`} sizeUnit={"px"} color={'#6c757d'} size={30} loading={true}/>
		</div>
	);
}
