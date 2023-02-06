import React from 'react';

export default function FooterSocialLinks({socialLinks}) {
  return (
    <ul className="footer__social-links">
      {socialLinks.map((item, i) => (
        <React.Fragment key={i}>
          <li>
            <a href={item.to}>
              <img src={item.icon} alt={item.label} />
            </a>
          </li>
        </React.Fragment>
      ))}
    </ul>
  );
}
