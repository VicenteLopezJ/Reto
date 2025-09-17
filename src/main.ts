// main.ts
import 'zone.js'; // ⚠️ debe ser la primera línea
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

async function main() {
  try {
    await bootstrapApplication(App, appConfig);
  } catch (err) {
    console.error('Error bootstrapping Angular app:', err);
  }
}

main();
