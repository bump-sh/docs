import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig} from '@docusaurus/theme-common';
import FooterLinks from '@theme/Footer/Links';
import FooterLogo from '@theme/Footer/Logo';
import FooterCopyright from '@theme/Footer/Copyright';
import FooterLayout from '@theme/Footer/Layout';
import FooterBottomLinks from '@theme/Footer/BottomLinks';
import FooterSocialLinks from '@theme/Footer/SocialLinks';
function Footer() {
  const {footer} = useThemeConfig();
  if (!footer) {
    return null;
  }
  const {copyright, links, logo, style} = footer;
  const {bottomLinks, socialLinks} = useDocusaurusContext().siteConfig.customFields;
  return (
    <FooterLayout
      style={style}
      links={links && links.length > 0 && <FooterLinks links={links} />}
      logo={logo && <FooterLogo logo={logo} />}
      copyright={copyright && <FooterCopyright copyright={copyright} />}
      bottomLinks={bottomLinks && <FooterBottomLinks bottomLinks={bottomLinks} />}
      socialLinks={socialLinks && <FooterSocialLinks socialLinks={socialLinks} />}
    />
  );
}
export default React.memo(Footer);
