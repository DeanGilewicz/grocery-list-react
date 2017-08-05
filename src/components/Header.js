import React, { Component } from 'react';

const Header = (props) => {
	return (
		<header>
			<h1>{props.tagline}</h1>
		</header>
	)
}

export default Header;