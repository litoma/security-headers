let securityHeaders = {
	"Content-Security-Policy" : "upgrade-insecure-requests",
	"Strict-Transport-Security" : "max-age=31536000; includeSubDomains; preload",
	"X-Xss-Protection" : "1; mode=block",
	"X-Frame-Options" : "sameorigin",
	"X-Content-Type-Options" : "nosniff",
	"Referrer-Policy" : "strict-origin-when-cross-origin",
	"Permissions-Policy" : "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
}

let sanitiseHeaders = {
	"Server" : "My New Server Header!!!",
}

let removeHeaders = [
	"Public-Key-Pins",
	"X-Powered-By",
	"X-AspNet-Version",
]

addEventListener('fetch', event => {
	event.respondWith(addHeaders(event.request))
})

async function addHeaders(req) {
	let response = await fetch(req)
	let newHdrs = new Headers(response.headers)

	if (newHdrs.has("Content-Type") && !newHdrs.get("Content-Type").includes("text/html")) {
		return new Response(response.body , {
			status: response.status,
			statusText: response.statusText,
			headers: newHdrs
		})
	}

	let setHeaders = Object.assign({}, securityHeaders, sanitiseHeaders)

	Object.keys(setHeaders).forEach(name => {
		newHdrs.set(name, setHeaders[name]);
	})

	removeHeaders.forEach(name => {
		newHdrs.delete(name)
	})

	return new Response(response.body , {
		status: response.status,
		statusText: response.statusText,
		headers: newHdrs
	})
}
