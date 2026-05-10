module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    require: ["step_definitions/**/*.ts"],
    requireModule: ["ts-node/register"],
    format: [
      `html:test-report.html`,
      "progress-bar",
    ],
    formatOptions: {
      html: {
        externalAttachments: true,
      },
    },
  },
};
