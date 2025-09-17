// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // Habilita Zone.js para detección de cambios
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Ruteo
    provideRouter(routes),

    // SSR/Hydration
    provideClientHydration(withEventReplay()),

    // Animaciones
    provideAnimations(),

    // Importar HttpClientModule
    importProvidersFrom(HttpClientModule),
  ],
};
