import React from 'react';
import ReactDOM from 'react-dom';
import SignUp from '../signup.component';

it("renders without crashing", ()=> {
    const div = document.createElement("div");
    ReactDOM.render(<SignUp />, div)
})