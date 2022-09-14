import Router from 'next/router';

type props = {
  route: string;
  text: string;
  user: [];
};
export function HeaderRouter({ route, text, user }: props) {
  return (
    <button
      className="text-xl font-semibold"
      onClick={() => Router.push(`${route}`)}
    >
      {text}
    </button>
  );
}
