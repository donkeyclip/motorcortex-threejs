export const applySettingsToObjects = (settings, obj) => {
  for (const key in settings) {
    if (settings[key] instanceof Array) {
      obj[key](...settings[key]);
      continue;
    } else if (settings[key] !== Object(settings[key])) {
      // is primitive
      obj[key] = settings[key];
      continue;
    }
    applySettingsToObjects(settings[key], obj[key]);
  }
};
