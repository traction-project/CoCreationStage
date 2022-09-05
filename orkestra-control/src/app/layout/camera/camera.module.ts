import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CameraRoutingModule } from "./camera-routing.module";
import { CameraComponent } from "./camera.component";
import { TranslateModule } from "@ngx-translate/core";
import {
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
} from "@angular/material";
import { TopBarModule } from "src/app/top-bar/top-bar.module";
import { ChatMobileComponent } from "src/app/shared/components/chat-mobile/chat-mobile.component";
import { ResizerDirective } from "src/app/shared/components/chat-mobile/resizer.directive";
import { NgChatModule } from "ng-chat";

@NgModule({
    imports: [
        CommonModule,
        CameraRoutingModule,
        TranslateModule.forChild(),
        MatDividerModule,
        MatMenuModule,
        MatIconModule,
        TopBarModule,
        NgChatModule,
    ],
    declarations: [CameraComponent, ChatMobileComponent, ResizerDirective],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CameraModule {}
