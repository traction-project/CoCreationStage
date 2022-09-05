import { Component, ViewChild, ElementRef } from "@angular/core";
import { Orkestra, URI } from "orkestraLib";
import { JanusClient } from "orkestraLib";
import { DataService } from "src/app/shared/services/data.service";
import { JanusPublishService } from "src/app/shared/services/janus.publish.service";
import { Title } from "@angular/platform-browser";
import { Message } from "src/app/shared/instruments/messages";
import { environment } from "src/environments/environment";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ModalComponent } from "src/app/shared/components/popup/modal.component";
import { JanusService } from "src/app/shared/services/janus.service";

/**
 * Camera Component that allows to the user send the camera stream and talk by chat with the controller
 */
@Component({
    selector: "camera-component",
    templateUrl: "./camera.component.html",
    styleUrls: ["./camera.component.scss"],
})
export class CameraComponent {
    orkestra: any; // Orkestra instance
    users: any;
    appData: any;
    app: any;
    dataService: any;
    actMsgs: any[] = [];
    start: string = "START";
    stop: string = "STOP";
    disabled: boolean = true;
    chat: boolean = false;
    @ViewChild("chatdiv") chatdiv: ElementRef;
    name: string = "";
    options: any;
    config: any;
    peerId: string;
    onairAt: string[] = [];
    started: boolean = false;
    oldFrom: any;
    oldMsg: any;
    statusStream: string = "Paused";
    statusButtonPlay: string = "Start";
    room: number;
    janusConfig: any;
    constructor(
        private titleService: Title,
        private elRef: ElementRef,
        dataService: DataService,
        private janusPublish: JanusPublishService,
        public matDialog: MatDialog,
        private janusAPI: JanusService
    ) {
        this.app = new Orkestra({
            url: "https://" + environment.sharedStateServer + "/",
            channel: URI.getUrlVar("channel"),
            profile: "camera",
            master: true,
            agentid: URI.getUrlVar("camera"),
        });
        this.dataService = dataService;
        this.janusConfig =
            '{"janusServer":"' + environment.janusIp + '","room":689}';
        this.titleService.setTitle("Camera Page");
        this.dataService.setAppInstance(this.app);
        this.name = URI.getUrlVar("camera");
        this.peerId = "cam_" + URI.getUrlVar("camera");
        let room: string = URI.getUrlVar("room");
        let roomInd: number = parseInt(room);
        this.room = roomInd;
        this.config = JSON.stringify({
            janusServer: environment.janusIp,
            room: roomInd,
        });
        this.options = JSON.stringify({
            audio: true,
            video: true,
            simulcast: true,
            portrait: false,
            bitrate: 2000000,
            res: 'HD',
            noiseS: false,
            echoC: false,
            gainC: false,
            delay: 0,
            showAudioInput: true,
        });
        (window as any).res = 'HD';
        (window as any).FlexJanus = JanusClient(
            null,
            environment.janusIp,
            parseInt(URI.getUrlVar("room"))
        );
        (window as any).FlexJanus.init(null);
        this.app.userObservable.subscribe(() => {
            this.dataService.setUsers(this.app.getUsers());
        });

        this.app.readyObservable.subscribe(() => {
            this.app.data("message", Message, "");
            this.app.subscribe("onair_" + this.app.getMyAgentId());
        });
        this.app.appObservable.subscribe((x) => {
            this.appData = this.app.getAppData();
            if (x.key.indexOf("micro") != -1) {
                console.log(x.key);
            } else if (
                x.key.indexOf("onair_" + this.app.getMyAgentId()) != -1
            ) {
                if (x.data) {
                    this.onairAt = x.data.value;
                } else {
                    this.onairAt = x.value;
                }
            }
        });
        setTimeout(() => {
            this.disabled = false;
            this.elRef.nativeElement
                .querySelector("webrtc-publisher")
                .playEventSubscriber()
                .subscribe((e) => {
                    this.toggleStylePlay(e);
                });
        }, 2000);
    }

    /* Lifecycle Methods */

    ngOnInit() {
        this.elRef.nativeElement
            .querySelector("app-top-bar")
            .setAttribute("display", false);
    }

    /* Component Methods */

    // Display setting of Webrtc-publisher component in order to configurate the stream
    toggleSettings() {
        this.elRef.nativeElement.querySelector("webrtc-publisher").showConfig();
    }
    // Check if the camera is sending the stream
    isOn() {
        return this.started && (window.FlexJanus as any).feeds.length !== 0;
    }
    // On Start/Pause button click
    onClickPlayPause(): void {
        if (this.statusButtonPlay === "Start") {
            this.publishCamera();
        } else {
            this.unpublishCamera();
        }
    }
    onClickCloseChat() {
        this.elRef.nativeElement
            .querySelector(".content")
            .classList.add("fullContent");
        this.elRef.nativeElement
            .querySelector(".pathChat")
            .classList.add("pathNoChat");
    }
    onClickOpenChat() {
        this.elRef.nativeElement
            .querySelector(".content")
            .classList.remove("fullContent");
        this.elRef.nativeElement
            .querySelector(".pathChat")
            .classList.remove("pathNoChat");
    }
    openYoutubeModal() {
        const dialogConfig = new MatDialogConfig();
        // The user can't close the dialog by clicking outside its body
        dialogConfig.disableClose = true;
        dialogConfig.id = "modal-component";
        dialogConfig.height = "860px";
        dialogConfig.width = "600px";
        dialogConfig.data = {
            optin_mode: "stageyt",
            sub_mode: "",
        };
        const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
        modalDialog.afterClosed().subscribe((data) => {
            console.log(data);
            if (data.type == "stageyt") {
                //  this.dataService.setTransitionConfig(data.data, "all");
            }
        });
    }
    // Publish camera to Youtube
    publishCameraToOtherService() {
        if (this.isOn()) {
            this.enableService();
            this.openYoutubeModal();
        } else {
            alert("Camera not ready to share, try later");
        }
    }
    goBack() {
        document.location.href = "/";
    }

    // Send camera stream
    private publishCamera() {
        this.started = true;
        this.elRef.nativeElement.querySelector("webrtc-publisher").publish();
        this.elRef.nativeElement
            .querySelector("webrtc-publisher")
            .setOrkestraInstance(this.app);
        this.started = true;
    }
    // Stop send camera stream
    private unpublishCamera() {
        this.started = false;
        this.elRef.nativeElement.querySelector("webrtc-publisher").unpublish();
    }

    private toggleStylePlay(e): void {
        const pauseBtn = this.elRef.nativeElement.querySelector("#pauseBtn");
        const led = this.elRef.nativeElement.querySelector("#led");
        if (e.type === "play") {
            pauseBtn.classList.remove("pause");
            pauseBtn.classList.add("pause");
            pauseBtn.classList.remove("play");
            this.statusButtonPlay = "Pause";
            led.classList.remove("ledOff");
            led.classList.remove("ledOn");
            led.classList.add("ledOn");
            this.statusStream = "Active";
        } else {
            pauseBtn.classList.remove("play");
            pauseBtn.classList.add("play");
            pauseBtn.classList.remove("pause");
            this.statusButtonPlay = "Start";
            led.classList.remove("ledOn");
            led.classList.remove("ledOff");
            led.classList.add("ledOff");
            this.statusStream = "Paused";
        }
    }
    private enableService() {
        this.janusAPI.setRoom(this.room);
        this.janusAPI.publisherExists(this.peerId, (flag) => {
            if (flag === true) this.janusAPI.enableRtpForward(this.peerId);
            else alert("Something when wrong, try reloading the page");
        });
    }
    // private disableService() {
    //     this.janusAPI.setRoom(this.room);
    //     this.janusAPI.disableRtpForward(this.peerId, () => {});
    // }
}
