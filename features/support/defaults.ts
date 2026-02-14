import { request, settings } from 'pactum';
import { Before } from '@cucumber/cucumber';

// Set project-wide defaults for each scenario
Before(() => {
  request.setBaseUrl('https://reqres.in');
  settings.setReporterAutoRun(false);
});
