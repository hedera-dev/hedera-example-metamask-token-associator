import React from "react";

function MyInputGroup(props) {
	return (
		<div>
			<p className="sub-text"> {props.text} </p>
			<input type="text" onChange={props.fcn} placeholder="e.g. 0x00000000000000000000000000000000001f0ba3" className="text-input" />
		</div>
	);
}

export default MyInputGroup;
