//#region node_modules/.nitro/vite/services/ssr/assets/regions--TbXEuvW.js
var REGIONS = [
	{
		id: "bangladesh",
		name: "Bangladesh",
		bbox: "88.0,20.5,92.7,26.6",
		center: [23.7, 90.4],
		zoom: 7
	},
	{
		id: "india",
		name: "India",
		bbox: "68.1,6.5,97.4,35.5",
		center: [21, 78],
		zoom: 5
	},
	{
		id: "amazon",
		name: "Amazon Basin",
		bbox: "-75.0,-15.0,-50.0,5.0",
		center: [-5, -62],
		zoom: 5
	},
	{
		id: "australia",
		name: "Australia",
		bbox: "113.0,-44.0,154.0,-10.0",
		center: [-25, 133],
		zoom: 4
	},
	{
		id: "california",
		name: "California",
		bbox: "-124.5,32.5,-114.1,42.0",
		center: [37.5, -119.5],
		zoom: 6
	}
];
var DEFAULT_REGION = REGIONS[0];
function getRegion(id) {
	return REGIONS.find((r) => r.id === id) ?? DEFAULT_REGION;
}
function parseBbox(bbox) {
	const [west, south, east, north] = bbox.split(",").map(Number);
	return {
		west,
		south,
		east,
		north
	};
}
var SENSOR_META = {
	MODIS: {
		label: "MODIS",
		instrument: "Moderate Resolution Imaging Spectroradiometer",
		platforms: "Terra & Aqua",
		resolution_m: 1e3,
		pixelLabel: "1 km pixel",
		color: "#4DA3FF",
		markerStyle: "hollow-ring",
		description: "Aqua & Terra · 1 km nadir resolution · twice-daily revisit per platform · 0–100 confidence score"
	},
	VIIRS: {
		label: "VIIRS",
		instrument: "Visible Infrared Imaging Radiometer Suite",
		platforms: "Suomi NPP & NOAA-20/21",
		resolution_m: 375,
		pixelLabel: "375 m pixel",
		color: "#FF6A2A",
		markerStyle: "solid",
		description: "NOAA-20/21 & Suomi NPP · 375 m I-band resolution · finer spatial boundary detection · low/nominal/high confidence"
	}
};
var CONFIDENCE_TIERS = [
	"low",
	"nominal",
	"high"
];
//#endregion
export { parseBbox as a, getRegion as i, REGIONS as n, SENSOR_META as r, CONFIDENCE_TIERS as t };
