import { client as default_client_render, server as default_server_render } from '../render'

import { match } from 'redux-router/server'
import { ReduxRouter } from 'redux-router'

import React          from 'react'
import ReactDOMServer from 'react-dom/server'

// returns a Promise for React component.
//
// renders directly to the "to" DOM element.
// (to allow for faster DOM mutations instead of simple slow Html code replacement)
export function client({ development, render, create_routes, store, to })
{
	let router_element = <ReduxRouter routes={create_routes({store})} />

	return render(router_element, {store}).then(element =>
	{
		return default_client_render
		({
			development, 
			element,
			to
		})
	})
}

// returns a Promise resolving to Html code.
export function server({ disable_server_side_rendering, render, render_html, url, store })
{
	if (disable_server_side_rendering)
	{
		return Promise.resolve({ markup: default_server_render({ html }) })
	}

	return new Promise((resolve, reject) =>
	{
		store.dispatch(match(url, (error, redirect_location, router_state) =>
		{
			if (redirect_location)
			{
				return resolve
				({
					redirect: redirect_location.pathname + redirect_location.search
				})
			}

			if (error)
			{
				return reject(error)
			}

			if (!router_state)
			{
				return reject(new Error('No router state'))
			}

			// Workaround redux-router query string issue:
			// https://github.com/rackt/redux-router/issues/106
			if (router_state.location.search && !router_state.location.query)
			{
				router_state.location.query = query_string.parse(router_state.location.search)
			}

			const get_status_from_routes = matched_routes =>
			{
				return matched_routes.reduce((previous, current) => (current && current.status) || (previous && current.status))
			}

			store.getState().router.then(() => 
			{
				const child_element = <ReduxRouter/>

				const status = get_status_from_routes(router_state.routes)

				resolve({ status, markup: '<!doctype html>\n' +
					ReactDOMServer.renderToString(render_html(render(child_element, {store}))) })
			})
			.catch(error =>
			{
				// log.error(error)
				error.markup = default_server_render({ render_html }) // let client render error page or re-request data
				throw error
			})
		}))
	})
}