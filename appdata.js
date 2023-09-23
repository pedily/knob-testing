import path from "path";

function prependDot(...app) {
  return app.map((item, i) => {
    if (i === 0) {
      return `.${item}`;
    } else {
      return item;
    }
  });
}

export function appData(...app) {
  let appData;
  if (process.platform === "win32") {
    appData = path.join(process.env.APPDATA, ...app);
  } else if (process.platform === "darwin") {
    appData = path.join(
      process.env.HOME,
      "Library",
      "Application Support",
      ...app
    );
  } else {
    appData = path.join(process.env.HOME, ...prependDot(...app));
  }
  return appData;
}
