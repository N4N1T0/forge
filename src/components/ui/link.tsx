import NextLink, { LinkProps as NextLinkProps } from 'next/link'

export interface LinkProps
  extends NextLinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  className?: string
  disabled?: boolean
  children: React.ReactNode
}

export const Link = ({
  href,
  as,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch,
  locale,
  className,
  children,
  disabled,
  ...rest
}: LinkProps) => {
  return (
    <NextLink
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
      prefetch={prefetch}
      locale={locale}
      className={disabled ? 'cursor-not-allowed' : className}
      {...rest}
    >
      {children}
    </NextLink>
  )
}
