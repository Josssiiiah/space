import * as React from 'react';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className="p-4 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          <h1 className="text-2xl text-blue-500 font-bold">Home</h1>
        </Link>{' '}
        <Link
          to="/about"
          activeProps={{
            className: 'font-bold',
          }}
        >
          <h1 className="text-2xl text-blue-500 font-bold">About</h1>
        </Link>
        <Link
          to="/space"
          activeProps={{
            className: 'font-bold',
          }}
        >
          <h1 className="text-2xl text-blue-500 font-bold">Space</h1>
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
