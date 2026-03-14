export const loggerConfig = {
  appenders: {
    testLog: { type: "file", filename: `logs/${new Date().toISOString()}.log` },
  },
  categories: { default: { appenders: ["testLog"], level: "trace" } },
};
