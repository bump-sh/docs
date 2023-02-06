import React from 'react';
import LinkItem from '@theme/Footer/LinkItem';

export default function FooterBottomLinks({bottomLinks}) {
  return (
    <ul className="footer__bottom-links">
      {bottomLinks.map((item, i) => (
        <React.Fragment key={i}>
          <li>
            <LinkItem item={item} />
          </li>
        </React.Fragment>
      ))}
    </ul>
  );
}
