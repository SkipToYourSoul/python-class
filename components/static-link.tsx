import * as React from 'react';

/**
 * 纯静态部署用链接组件。
 *
 * vinext/Next 的 next/link 依赖运行时 RSC router 做客户端预取与转场；
 * 站点静态导出并托管到无 Worker 的纯静态平台时，该 router 缺失会导致
 * “RSC prefetch setup error / f is not a function”。
 *
 * 这里直接渲染原生 <a>，走普通整页跳转，无任何客户端 JS，
 * 兼容服务端组件与客户端组件，支持本站用到的 href / className / aria-label。
 */
type StaticLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> & {
  href: string;
};

export default function StaticLink({
  href,
  children,
  ...rest
}: StaticLinkProps) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
