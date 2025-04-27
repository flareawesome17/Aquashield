const marineHotzones = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name: "Baobaoan Sanctuary",
          type: "Sanctuary",
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [123.7381, 8.6158],
            [123.7419, 8.6136],
            [123.7386, 8.6092],
            [123.7347, 8.6114],
            [123.7381, 8.6158],
          ]],
        },
      },
      {
        type: "Feature",
        properties: {
          name: "Usocan Shoal MPA",
          type: "Marine Protected Area",
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [123.6778, 8.6472],
            [123.6833, 8.5308],
            [123.6778, 8.6444],
            [123.6833, 8.6444],
            [123.6778, 8.6472],
          ]],
        },
      },
    ],
  };
  
  export default marineHotzones;
  