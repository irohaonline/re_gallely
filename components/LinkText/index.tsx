import Link from 'next/link';
import { AnchorHTMLAttributes, FC } from 'react';

/**
 * This is just a wrapper component of Next Link
 * created to address the problem of react-i18next Trans component
 *
 * Ref: https://github.com/i18next/react-i18next/issues/1090#issuecomment-615426145
 */

type Props = AnchorHTMLAttributes<HTMLAnchorElement>;

const LinkText: FC<Props> = ({ href, children, ...rest }: Props) => (
  <Link href={href}>
    <a {...rest}>{children}</a>
  </Link>
);

export default LinkText;

