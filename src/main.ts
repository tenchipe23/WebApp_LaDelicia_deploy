import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideAnimations(), // 👈 Habilita las animaciones en toda la app
    ...(appConfig.providers || []) // Mantiene los demás providers de appConfig
  ]
}).catch((err) => console.error(err));
