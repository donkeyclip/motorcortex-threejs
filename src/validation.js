export const intro = {
  title: {
    optional: false,
    type: "string",
  },
  subtitle: {
    optional: false,
    type: "string",
  },
  month: {
    optional: false,
    type: "string",
  },
  bgUrl: {
    optional: true,
    type: "string",
  },
  mainColor: {
    optional: true,
    type: _COLOR,
  },
  description: {
    optional: false,
    type: "string",
  },
  speed: {
    optional: true,
    type: "number",
    min: 0,
  },
  overlayColor: {
    optional: true,
    type: "array",
    min: 2,
    items: {
      optional: true,
      type: _COLOR,
    },
  },
};
