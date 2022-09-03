import React from "react";

import footerStyles from "./footer.module.scss";
import { TiSocialFacebookCircular } from "react-icons/ti";
import { TiSocialLinkedin } from "react-icons/ti";
import { TiSocialInstagram } from "react-icons/ti";
import { TiSocialTwitter } from "react-icons/ti";
import { TiSocialGooglePlusCircular } from "react-icons/ti";

import { IconContext } from "react-icons";

const Footer = () => {
  return (
    <footer class={footerStyles.footer}>
      <div class="container">
        <div className={footerStyles.iconsContainer}>
          <ul class="list-unstyled list-inline text-center">
            <li class="list-inline-item">
              <a href="" class="btn-floating btn-fb mx-1">
                <IconContext.Provider
                  value={{
                    color: "blue",
                    size: 50,
                    style: { verticalAlign: "center" },
                    className: "global-class-name",
                  }}
                >
                  <div>
                    <TiSocialFacebookCircular />
                  </div>
                </IconContext.Provider>
              </a>
            </li>
            <li class="list-inline-item">
              <a class="btn-floating btn-tw mx-1">
                <IconContext.Provider
                  value={{
                    color: "blue",
                    size: 50,
                    style: { verticalAlign: "center" },
                    className: "global-class-name",
                  }}
                >
                  <div>
                    <TiSocialInstagram />
                  </div>
                </IconContext.Provider>
              </a>
            </li>
            <li class="list-inline-item">
              <a class="btn-floating btn-gplus mx-1">
                <IconContext.Provider
                  value={{
                    color: "blue",
                    size: 50,
                    style: { verticalAlign: "center" },
                    className: "global-class-name",
                  }}
                >
                  <div>
                    <TiSocialTwitter />
                  </div>
                </IconContext.Provider>
              </a>
            </li>
            <li class="list-inline-item">
              <a class="btn-floating btn-li mx-1">
                <IconContext.Provider
                  value={{
                    color: "blue",
                    size: 50,
                    style: { verticalAlign: "center" },
                    className: "global-class-name",
                  }}
                >
                  <div>
                    <TiSocialLinkedin />
                  </div>
                </IconContext.Provider>
              </a>
            </li>
            <li class="list-inline-item">
              <a class="btn-floating btn-dribbble mx-1">
                <IconContext.Provider
                  value={{
                    color: "blue",
                    size: 50,
                    style: { verticalAlign: "center" },
                    className: "global-class-name",
                  }}
                >
                  <div>
                    <TiSocialGooglePlusCircular />
                  </div>
                </IconContext.Provider>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={footerStyles.innerContainer}>
        <div class="footer-copyright text-center py-3">
          © 2020 Copyright:
          <a href="debatable.com.au"> Debatable.com.au</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
