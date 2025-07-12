export function getActiveRoute(navigationState: { routes: { [x: string]: any; }; index: string | number; }) {
    if (!navigationState) {
        return null;
    }

    const route = navigationState.routes[navigationState.index];
    if (!route) {
        return null
    }

    // dive into nested navigators
    if (route.routes) {
        return getActiveRoute(route);
    }

    return route;
}
