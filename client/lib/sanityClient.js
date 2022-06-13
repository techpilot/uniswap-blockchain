import sanityClient from "@sanity/client";

export const client = sanityClient({
  projectId: "myclyc1b",
  dataset: "production",
  apiVersion: "v1",
  useCdn: false,
  token:
    "skoLE4UzG1DJttUAsyoGdTvyCTXGdA5ifGN7hB1JwUn0AMvch31bSvBoxIco2tM2ITCd1DWlVV8TzrwjgNHbz2xIVLEprYICPC0XI2zPxhaVpWVUJ8fAuVrrmPhy9O8or1D1UaGukxqXY0XFoBmoZ6Uog2F8K0mrPh43hLQse8Sgvtq959Ay",
});
