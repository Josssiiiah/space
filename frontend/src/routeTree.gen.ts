/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SpaceImport } from './routes/space'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'
import { Route as ChatIdImport } from './routes/chat.$id'

// Create/Update Routes

const SpaceRoute = SpaceImport.update({
  id: '/space',
  path: '/space',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const ChatIdRoute = ChatIdImport.update({
  id: '/chat/$id',
  path: '/chat/$id',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/space': {
      id: '/space'
      path: '/space'
      fullPath: '/space'
      preLoaderRoute: typeof SpaceImport
      parentRoute: typeof rootRoute
    }
    '/chat/$id': {
      id: '/chat/$id'
      path: '/chat/$id'
      fullPath: '/chat/$id'
      preLoaderRoute: typeof ChatIdImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/space': typeof SpaceRoute
  '/chat/$id': typeof ChatIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/space': typeof SpaceRoute
  '/chat/$id': typeof ChatIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/space': typeof SpaceRoute
  '/chat/$id': typeof ChatIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/about' | '/space' | '/chat/$id'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/about' | '/space' | '/chat/$id'
  id: '__root__' | '/' | '/about' | '/space' | '/chat/$id'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  SpaceRoute: typeof SpaceRoute
  ChatIdRoute: typeof ChatIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  SpaceRoute: SpaceRoute,
  ChatIdRoute: ChatIdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/space",
        "/chat/$id"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/space": {
      "filePath": "space.tsx"
    },
    "/chat/$id": {
      "filePath": "chat.$id.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
