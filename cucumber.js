module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    require: ["step_definitions/*.ts"],
    requireModule: ["ts-node/register"]
  },
};
