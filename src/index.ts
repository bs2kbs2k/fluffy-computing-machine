/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
}

const ZOOM: number = 10;

// From https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_(JavaScript/ActionScript,_etc.)
function lon2tile(lon: number, zoom: number): number {
	return (Math.floor((lon+180)/360*Math.pow(2,zoom)));
}
function lat2tile(lat: number, zoom: number): number {
	return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		if (typeof request.cf?.longitude == "string" && typeof request.cf?.latitude == "string") {
			// Yes I'm not doing attribution properly
			// So be careful and only share the link with proper attribution
			return fetch(`https://tile.openstreetmap.org/${ZOOM}/${lon2tile(+request.cf?.longitude, ZOOM)}/${lat2tile(+request.cf?.latitude, ZOOM)}.png`, {
				headers: [["User-Agent", "DangerousGlassesJokeBot/1.0 (compatible; +https://bs2k.me/random.html)"]]
			});
		} else {
			return new Response("oops");
		}
	},
};
