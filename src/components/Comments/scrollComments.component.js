import React from "react";

const ScrollComments = (props) => {
  return (
    <div
      style={{
        overflowY: "scroll",
        height: "50vh",

        // width: '400px',
        // padding: '15px 0',
        // lineHeight: '1.2',
        // textAlign: 'center'
      }}
    >
      {props.children}
    </div>
  );
};

export default ScrollComments;
