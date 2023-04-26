import React from 'react';
import clsx from 'clsx';
import {useBlogPost} from '@docusaurus/theme-common/internal';
import BlogPostItemContainer from '@theme/BlogPostItem/Container';
import BlogPostItemHeader from '@theme/BlogPostItem/Header';
import BlogPostItemContent from '@theme/BlogPostItem/Content';
import BlogPostItemFooter from '@theme/BlogPostItem/Footer';

// apply a bottom margin in list view
function useContainerClassName() {
  const {isBlogPostPage, metadata} = useBlogPost();
  const {date, formattedDate} = metadata;
  return !isBlogPostPage ? 'margin-bottom--xl' : undefined;
}

function Date({date, formattedDate}) {
  return (
    <time dateTime={date} itemProp="datePublished">
      {formattedDate}
    </time>
  );
}

export default function BlogPostItem({children, className}) {
  const {metadata} = useBlogPost();
  const {date, formattedDate} = metadata;
  const containerClassName = useContainerClassName();
  return (
    <BlogPostItemContainer className={clsx(containerClassName, className), "entry"}>
      <div className="entryDate">
        <Date date={date} formattedDate={formattedDate} />
      </div>
      <div className="blogPostColumn">
        <BlogPostItemHeader />
        <BlogPostItemContent>{children}</BlogPostItemContent>
        <BlogPostItemFooter />
      </div>
    </BlogPostItemContainer>
  );
}
