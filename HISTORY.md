2.0.0 / 19.01.2016
==================

  * changed `markup_wrapper` from a function to a React component
  * internationalization messages are now not passed from server to client but are instead loaded during client-side rendering (to allow for Hot Module Replacement aka hot reload)
  * extensive refactoring and some minor features added

1.4.1 / 07.01.2016
==================

  * can now use `Promise`s returned from Redux dispatched actions

1.4.0 / 03.01.2016
==================

  * changed `body` function a bit
  * removed `to` from client-side rendering function parameters

1.2.0 / 26.12.2015
==================

  * changed `preload` arguments order

1.2.0 / 26.12.2015
==================

  * simplified website "favicon" insertion into <head/>
  * `styles` parameter renamed to `style`

1.1.0 / 26.12.2015
==================

  * `create_routes` is now required on server-side too
  * `create_store` simplifed

1.0.2 / 25.12.2015
==================

  * API refactoring

1.0.0 / 24.12.2015
==================

  * Initial release