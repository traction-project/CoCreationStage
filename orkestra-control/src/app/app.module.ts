import { NgModule,CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA,LOCALE_ID,APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';
import { AppComponent } from './app.component';
import { DataService } from './shared/services/data.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MotionService } from './shared/services/motion.service';
import { JanusService } from './shared/services/janus.service';
import { AppRoutingModule } from './app-routing.module';
import { JanusPublishService } from './shared/services/janus.publish.service';
import { ModalComponent } from './shared/components/popup/modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { JetsonService } from './shared/services/jetson.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { NotificationService } from './shared/services/notification.service';
import { AuthService } from './shared/services/auth.service';
import { DBService } from './shared/services/db.service';
import { UploadService } from './shared/upload/upload.service';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';
import { ResizerDirective } from './shared/components/chat-mobile/resizer.directive';
import { SafePipe } from './shared/pipes/safe';
import { YTService } from './shared/services/yt.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'https://stage.traction-project.eu:8443/auth',
        realm: 'traction',
        clientId: environment.keycloak_app,
      },
      bearerExcludedUrls: environment.publicPaths,
      initOptions: {
        onLoad: 'check-sso',
        promiseType:"native",
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
    });
}
@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    NoopAnimationsModule,
    MatListModule,
    HttpClientModule,
    MatSnackBarModule,
    KeycloakAngularModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
  })
    ],
  declarations: [
    AppComponent,ModalComponent,SafePipe
  ],
  providers:[
    DataService,
    DBService,
    MotionService,
    JanusService,
    JanusPublishService,
    JetsonService,
    NotificationService,
    TranslateService,
    AuthService,
    UploadService,
     {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    YTService
  ],
  bootstrap: [ AppComponent ],
  entryComponents: [ModalComponent],
  schemas: [
   CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
 ]
})
export class AppModule { }
