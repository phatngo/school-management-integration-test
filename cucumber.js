module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    require: ["step_definitions/**/*.ts"],
    requireModule: ["ts-node/register"],
    format: [
      'progress-bar',
      'html:test-report.html'
    ],
    // formatOptions: {
    //   html: {
    //     externalAttachments: true,
    //   },
    // },
  },
};
