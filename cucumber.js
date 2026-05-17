module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    require: ["step_definitions/**/*.ts"],
    requireModule: ["ts-node/register"],
    format: [
      'progress-bar',
      'html:test-report.html'
    ],
    parallel: process.env.PARALLEL || 1
  },
};
