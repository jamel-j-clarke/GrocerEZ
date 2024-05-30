function log( ...data ) {
    console.log( `SW1.0`, ...data );
}

log( `SW Script executing - adding event listeners` );

const STATIC_CACHE_NAME = `grocerez-static-v0`;


self.addEventListener( `install`, event => {
    log( `install`, event );
    event.waitUntil(
        caches.open( STATIC_CACHE_NAME ).then( cache => {
            return cache.addAll([
                '/offline',
                // CSS
                '/css/item_styles.css',
                '/css/landing_styles.css',
                '/css/mobile_landing_styles.css',
                '/css/mobile_styles.css',
                '/css/problem_styles.css',
                '/css/styles.css',
                // images
                '/images/groceries.jpeg',
                '/images/meal-prep.jpg',
                '/images/notebooks.jpg',
                // scripts
                '/js/shared.js',
                '/js/currentList.js',
                '/js/items.js',
                '/js/landing.js',
                '/js/lists.js',
                '/js/recipes.js',
                // api scripts
                '/js/api_clients/HTTPClient.js',
                '/js/api_clients/APICurrentListClient.js',
                '/js/api_clients/APIItemClient.js',
                '/js/api_clients/APIListClient.js',
                '/js/api_clients/APIRecipeClient.js',
                '/js/api_clients/APIUserClient.js',
            ]);
        })
    );
});

self.addEventListener( `activate`, event => {
    log( `activate`, event );
    event.waitUntil(
        caches.keys().then( cacheNames => {
            return Promise.all(
                cacheNames.filter( cacheName => {
                    return cacheName.startsWith( `grocerez-` ) && cacheName != STATIC_CACHE_NAME;
                }).map( cacheName => {
                    return caches.delete( cacheName );
                })
            );
        })
    );
});

self.addEventListener( `fetch`, event => {
    let requestURL = new URL ( event.request.url );
    if( requestURL.origin === location.origin && requestURL.pathname.startsWith( `/api` ) ) {
        if ( event.request.method === `GET` ) {
            event.respondWith(
                networkFirst( event.request )
            );
        } else if ( event.request.method === `POST` && requestURL.pathname.endsWith( `logout` ) ) {
            window.location.href = `/`;
        }
    } else {
        event.respondWith( 
            networkFirst( event.request )
        );
    }
});

function networkFirst( request ) {
    return fetch( request ).then( response => {
        let requestURL = new URL ( request.url );
        // cache everything except the landing page
        console.log( "networkfirst response: " + JSON.stringify(response) );
        if ( response.ok ) {
            caches.open( STATIC_CACHE_NAME ).then( cache => {
                cache.put( request, response );
            });
            return response.clone();
        } else if(response.status == 401) {
            throw new Error("Unauthorized");
        } else {
            return checkCache( request );
        }
        
    }).catch(err => {
        if(err.status == 401) {
            throw new Error("Unauthorized");
        } else {
            return checkCache( request );
        }
    })
}

function checkCache( request ) {
    return caches.match( request ).then( response => {
        console.log( `cache response: ${ response }` );
        return response;
    }).catch( error => {
        return caches.match( `/offline` );
    })
}

self.addEventListener( `message`, event => {
    log( `message`, event.data );
    if ( event.data.action === `skipWaiting` ) {
        self.skipWaiting();
    }
});