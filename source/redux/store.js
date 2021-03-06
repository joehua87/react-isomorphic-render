import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

import asynchronous_middleware from './asynchronous middleware'
import transition_middleware from './transition middleware'

import dev_tools from './dev tools'

import http_client from '../http client'

import { routerStateReducer } from 'redux-router'

import { createRoutes } from 'react-router/lib/RouteUtils'

import { reduxReactRouter as reduxReactRouter_client } from 'redux-router'
import { reduxReactRouter as reduxReactRouter_server } from 'redux-router/server'

import createHistory_server from 'history/lib/createMemoryHistory'
import createHistory_client from 'history/lib/createBrowserHistory'

// Three different types of scroll behavior available.
// Documented at https://github.com/rackt/scroll-behavior
//
// Possibly currently doesn't make any difference
import use_scroll from 'scroll-behavior/lib/useStandardScroll'

// @stevoland wrote this for `react-redux-universal-hot-example`.
// I'm not sure if it's needed anymore.
//
// Wrap the hooks so they don't fire if they're called before
// the store is initialised. This only happens when doing the first
// client render of a route that has an onEnter hook
function makeHooksSafe(routes, store)
{
	if (Array.isArray(routes))
	{
		return routes.map((route) => makeHooksSafe(route, store))
	}

	const onEnter = routes.onEnter

	if (onEnter)
	{
		routes.onEnter = function safeOnEnter(...args)
		{
			try
			{
				store.getState()
			}
			catch (err)
			{
				if (onEnter.length === 3)
				{
					args[2]()
				}

				// There's no store yet so ignore the hook
				return
			}

			onEnter.apply(null, args)
		}
	}

	if (routes.childRoutes)
	{
		makeHooksSafe(routes.childRoutes, store)
	}

	if (routes.indexRoute)
	{
		makeHooksSafe(routes.indexRoute, store)
	}

	return routes
}

// @stevoland wrote this for `react-redux-universal-hot-example`.
// I'm not sure if it's needed anymore.
function makeRouteHooksSafe(create_routes)
{
	return store => makeHooksSafe(createRoutes(create_routes(store)), store)
}

export default function(get_reducers, { development, development_tools, server, data, create_routes, http_request, host, port }) 
{
	// whether to return a `reload()` function to hot reload store
	let reloadable = true

	// allows simplified store creation 
	// (with reducer object instead of a function returning reducer object)
	if (typeof get_reducers !== 'function')
	{
		// generate proper `get_reducers` function
		const reducers = get_reducers
		get_reducers = () => reducers

		// no way to reload store in this case
		// (or if there is the open an issue on github)
		reloadable = false
	}

	// server-side and client-side specifics
	create_routes          = server ? create_routes : makeRouteHooksSafe(create_routes)
	const reduxReactRouter = server ? reduxReactRouter_server : reduxReactRouter_client
	const createHistory    = server ? createHistory_server : use_scroll(createHistory_client)

	// Redux middleware
	const middleware = [asynchronous_middleware(new http_client({ host, port, clone_request: http_request })), transition_middleware(server)]
	
	// Store creation function
	let create_store

	// Generate store creation function
	if (development && !server && development_tools)
	{
		const { persistState } = require('redux-devtools')

		create_store = compose
		(
			applyMiddleware(...middleware),
			// Provides support for DevTools:
			dev_tools.instrument(),
			// Lets you write ?debug_session=<name> in address bar to persist debug sessions
			persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
		)
		(createStore)
	} 
	else
	{
		create_store = applyMiddleware(...middleware)(createStore)
	}

	// keeps react-router state in Redux
	create_store = reduxReactRouter({ getRoutes: create_routes, createHistory })(create_store)

	// adds redux-router reducers to the list of all reducers
	const overall_reducer = () =>
	{
		const model = get_reducers()
		model.router = routerStateReducer
		return combineReducers(model)
	}

	// create store
	const store = create_store(overall_reducer(), data)
	
	// // client side hot module reload for Redux reducers attempt
	// // (won't work because it's not an immediate parent module for the reducers)
	// // https://github.com/webpack/webpack/issues/1790
	// if (development && module.hot)
	// {
	// 	module.hot.accept(reducers_path, () =>
	// 	{
	// 		store.replaceReducer(overall_reducer())
	// 	})
	// }

	if (!reloadable)
	{
		return store
	}

	return { store, reload: () => store.replaceReducer(overall_reducer()) }
}
