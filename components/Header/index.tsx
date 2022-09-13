import Image from 'next/image';
import Router from 'next/router';
import { HeaderRouter } from './HeaderRouter';

export function MainHeader() {
  return (
    <nav className="m-auto max-w-7xl flex justify-between items-center h-20 py-0 px-2.5">
      <Image
        src="/img/weco.png"
        width="150"
        height="150"
        onClick={() => Router.push('/')}
      />
      <div className="flex gap-8 items-center">
        <HeaderRouter route="post" text="새글쓰기" />
        <HeaderRouter route="login" text="로그인" />
      </div>
    </nav>
  );
}
