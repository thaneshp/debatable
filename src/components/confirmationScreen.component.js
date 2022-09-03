import React, { useEffect, useState, useCallback } from "react";
import confirmStyle from "./confirmationScreen.module.scss";
import { TiTick } from "react-icons/ti";
import { IconContext } from "react-icons";
import { useHistory } from "react-router-dom";

const ConfirmationScreen = ({ message, countDown, countDownMessage }) => {
  const [seconds, setSeconds] = useState(5);
  const history = useHistory();

  useEffect(() => {
    if (countDown) {
      if (seconds > 0) {
        setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        countDownHandler();
      }
    }
  });

  const countDownHandler = useCallback(() => {
    history.push({
      pathname: "/",
    });
  }, [history]);

  return (
    <div>
      <div className={confirmStyle.tick}>
        <IconContext.Provider
          value={{
            color: "green",
            size: 130,
            style: { verticalAlign: "center" },
            className: "global-class-name",
          }}
        >
          <div>
            <TiTick />
          </div>
        </IconContext.Provider>
      </div>

      <div className={confirmStyle.text}>
        {message}
        {countDown && (
          <div className={confirmStyle.countDown}>
            {countDownMessage} {seconds} seconds
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationScreen;
