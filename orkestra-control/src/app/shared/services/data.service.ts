import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UserData } from 'orkestraLib';
import { DomSanitizer } from '@angular/platform-browser';
import { Show } from '../models/show.class';
import { Room } from '../models/room.class';
import { DBService } from './db.service';
import { UploadService } from '../upload/upload.service';
import { environment } from 'src/environments/environment';



@Injectable()
export class DataService {

	private data: any = [];

	camObserver: any;
	camObservable: any;
	actObserver: any;
	actObservable: any;
	viewObserver: any;
	viewObservable: any;
	showObservable: any;
	msgObserver: any;
	showObserver: any;
	msgObservable: any;
	cameras: any[] = [];
	actors: any[] = [];
	viewers: any[] = [];
	instance: any;
	shows: any[] = [];
	users: any[] = [];
	private webrtcStreams: any = [];
	activeLayout: string = "divided";
	activeRoom: string = 'Room0';
	activeShow: string = "name";
	selectedDevice: string;
	nosignalConf: string = "";
	language: any = {
		name: "English",
		locale: "en"
	}
	languages: any = [
		{
			name: "English",
			locale: "en"
		},
		{
			name: "Português",
			locale: "pt"
		},
		{
			name: "Euskera",
			locale: "eus"
		},
		{
			name: "Español",
			locale: "es"
		},
		{
			name: "Catalan",
			locale: "cat"
		},
	]
	constructor(private sanitizer: DomSanitizer, private dbService: DBService, private uploadService: UploadService) {
		this.viewObserver = new Subject();
		this.camObserver = new Subject();
		this.actObserver = new Subject();
		this.msgObserver = new Subject();
		this.showObserver = new Subject();
		this.camObservable = new Observable((observer) => { this.camObserver.subscribe(observer); });
		this.actObservable = new Observable((observer) => { this.actObserver.subscribe(observer) });
		this.viewObservable = new Observable((observer) => { this.viewObserver.subscribe(observer); });
		this.msgObservable = new Observable((observer) => { this.msgObserver.subscribe(observer); });
		this.showObservable = new Observable((observer) => { this.showObserver.subscribe(observer); });

	}
	setCameras(cam) {
		if (this.cameras.length > 0) {
			cam.forEach(element => {
				if (cam.url)
					cam.push(element);
			});
		}
		if (cam.length > 0) this.cameras = cam;
		this.camObserver.next(this.cameras);

	}
	setActors(act) {
		this.actors = act;
		this.actObserver.next(this.actors);

	}
	addMediaToShow(files: any) {
		let show: Show = this.getActiveShow();
		if (this.getActiveShow().multimedia.length < files.length) {
			this.getActiveShow().multimedia = files;
			this.dbService.updateShow(show.name, show);
		}

	}
	removeMediaToShow(file: string) {
		let show: Show = this.getActiveShow();
		show.multimedia = show.multimedia.filter((m) => {
			if (m.name !== file) return true;
			return false;
		})
		this.dbService.updateShow(show.name, show);
	}
	addMediaFileToShow(file: any) {
		let path = "";
		if (file.url.toLowerCase().indexOf('.png') == -1 && file.url.toLowerCase().indexOf('.jpg') == -1
			&& file.url.toLowerCase().indexOf('.jpeg') == -1
			&& file.url.toLowerCase().indexOf('.gif') == -1
			&& file.url.toLowerCase().indexOf('.svg') == -1
			&& file.url.toLowerCase().indexOf('.webp') == -1) {
			path = file.url.replace('upload', 'upload/transcoded');
			path = path.replace(/\.(mov)($|\?)/, '.mpd$2');
			path = path.replace(/\.(webm)($|\?)/, '.mpd$2');
			path = path.replace(/\.(mpg)($|\?)/, '.mpd$2');
			path = path.replace(/\.(mpeg)($|\?)/, '.mpd$2');
			path = path.replace(/\.(ogv)($|\?)/, '.mpd$2');
			path = path.replace(/\.(mp4)($|\?)/, '.mpd$2');
			path = path.replace(/\.(mkv)($|\?)/, '.mpd$2');
		}
		else {
			path = file.url;
		}
		this.getActiveShow().multimedia.push({ name: file.name, url: environment.subdomains[Math.floor(Math.random() * 3) + 1] + path });
		this.uploadService.encode(file, environment.resolutions);
		let show: Show = this.getActiveShow();
		this.dbService.updateShow(show.name, show);

	}
	setNoSignalConfDev(agentId: string) {
		this.nosignalConf = agentId;
	}
	isNoSignalConfDev(image: any) {
		var confImg = this.getActiveShow().nosignalimgs.filter((dev) => {
			return dev.agentid == this.nosignalConf;
		});
		if (confImg.length > 0) {
			if (confImg[0].url == image.url) {
				return true;
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
	}
	setNoSignal(data: any, agentId: string) {
		let image: any = data[0];
		let show: Show = this.getActiveShow();
		if (!show.nosignalimgs) show.nosignalimgs = [];
		let nosignals: any = show.nosignalimgs;
		let findImg = nosignals.find((x) => {
			if (x.agentid === agentId) return true;
		})
		if (findImg) {
			findImg.url = image.url;
		}
		else {
			nosignals.push({ url: image.url, agentid: agentId });
		}
		this.dbService.updateShow(show.name, show);
		this.instance.setAppAttribute('nosignals', { data: nosignals });

	}
	getNoSignal(agentId: string) {
		return this.getActiveShow().nosignalimgs.filter((dev) => {
			return dev.agentid == agentId;
		});
	}
	copyComponents(from: string, to: any, compentsStatus: any) {
		console.log("from", from, "to", to, "componentStatus", compentsStatus);
		let devName = from.split('_')[1];
		let activeR: Room = this.getActiveRoomObj()[0];
		let fromdevice: any = activeR.devices.find((d) => {
			if (d.name === devName) return true;
			return false;
		})
		if (to.includes('all')) {
			let showActive: Show = this.getActiveShow();
			showActive.rooms.forEach((r) => {

				r.devices.forEach((device) => {

					device.components.forEach((cp, i) => {
						if (cp.source === "")
							cp.source = fromdevice.components[i].source;
					})

				})

			})

		}
		else {
			let todevices = to.filter((d) => {
				if (d !== "all") return true;
			});
			todevices.forEach((d) => {
				let dname: string = d.split('_')[1];
				let rname: string = d.split('_')[0];
				let showActive: Show = this.getActiveShow();
				showActive.rooms.forEach((r) => {
					if (r.name === rname) {
						r.devices.forEach((device) => {
							if (device.name === dname) {
								device.components.forEach((cp, i) => {
									if (cp.source === "") cp.source = fromdevice.components[i].source;
								})
							}
						})
					}
				})
			})
		}
		this.saveTimeline(compentsStatus);
	}
	setShows(shows: any) {
		this.shows = shows;
	}
	setSelectedDevice(name: string) {
		this.selectedDevice = name;
		this.showObserver.next({ "type": "device", "data": { "name": name } });
	}
	getSelectedDevice(): string {
		return this.selectedDevice || this.getActiveRoomObj()[0].devices[0].name || this.getActiveShow().rooms[0].devices[0].name;
	}
	getSelectedDeviceId(): string {
		return this.activeRoom + "_" + this.getSelectedDevice();
	}
	getViewerTypeDev() {
		var devs = [];
		this.getActiveShow().rooms.forEach((r) => {
			r.devices.forEach((d) => {
				if (d.type == "device") {
					devs.push(d.id);
				}
			});
		});
		return devs;
	}
	setActiveRoom(name: string) {
		this.activeRoom = name;
		this.selectedDevice = this.getActiveRoomObj()[0].devices[0].name;
		this.showObserver.next({ "type": "room", "data": { "name": name } });

	}

	saveTimeline(componentsStatus: any) {
		let show: Show = this.getActiveShow();
		show.rooms.forEach((r) => {

			r.devices.forEach((d) => {
				d.components = componentsStatus[r.name][d.name].components;
			})
		})
		show.nosignalimg = componentsStatus.nosignalimg;
		this.dbService.updateShow(show.name, show);

	}
	setTransitionConfig(data: any) {
		let show: Show = this.getActiveShow();
		show.transitionConfig = data;
		this.dbService.updateShow(show.name, show);
		this.instance.setAppAttribute('appConfig', { transitionConfig: { color: data.color, time: data.time } });
	}
	getActiveRoom(): string {
		return this.activeRoom;
	}
	getActiveRoomObj(): any {
		return this.getActiveShow().rooms.filter((r) => {
			return r.name == this.activeRoom
		});
	}
	addShow(show: Show) {
		this.shows.push(show);
		this.dbService.updateShow(show.name, show);
	}
	updateShow(show: Show) {
		this.dbService.updateShow(show.name, show);

	}
	deleteShow(showName: string) {
		this.shows = this.shows.filter((s) => {
			if (s.name === showName) return false;
			return true;
		})
		return this.shows;
	}
	getShows(): any {
		return this.shows;
	}
	setShowRooms(name: string, rooms: Room[]) {
		let show: Show = this.getShowByName(name);
		show.rooms = rooms;
		this.dbService.updateShow(show.name, show);
	}
	getShowByName(name: string): any {
		let show: Show = this.shows.find(x => x.name == name);
		return show;
	}
	setWebRtcStreams(sts: any) {
		this.webrtcStreams = sts;
	}
	getWebrtcStreams() {
		return this.webrtcStreams;
	}
	getActors(): any {
		return this.actors;
	}
	addActorMedia(id: string, media: any) {
		id = id.split('_')[1];
		let actor = this.getActor(id);
		actor.media = media;
		this.actObserver.next(this.actors);
	}
	getActor(id: string) {
		let actor = this.actors.find((ac) => { if (ac.agentid === id) return true });
		return actor;
	}
	setViewers(view, id) {
		this.viewers = view;
		let userD = this.instance.getUserData(view[id].agentid, "userData");
		if (view[id].status)
			userD.canpublish = true;
		else userD.canpublish = false;
		this.instance.setUserData(view[id].agentid, "userData", userD);
		this.viewObserver.next(this.viewers);

	}
	setUsers(users: any) {
		this.users = JSON.parse(users);
		this.users = this.users.map((us) => {
			if (!us[1].userData) us[1].name = us[1].agentid;
			else if (!("name" in us[1].userData)) us[1].name = us[1].agentid;
			else if (us[1].userData.name != "") us[1].name = us[1].userData.name;
			if (us[1].capacities.userData)
				us[1].status = us[1].capacities.userData.canpublish || 0;
			else
				us[1].status = 0;
			us[1].id = us[1].agentid;
			us[1].number = us[1].agentid;
			us[1].color = '#' + Math.floor(Math.random() * 16777215).toString(16);
			return us[1];
		})
		let userExceptMe = this.users.filter((us) => { if (us.name !== "me") return true; else return false });

		this.actors = userExceptMe.filter((usr) => { if (usr.profile == "actor") return true; else return false; });
		this.viewers = userExceptMe.filter((usr) => { if (usr.profile == "viewer") return true; else return false; });
		this.viewObserver.next(this.viewers);
		this.actObserver.next(this.actors);
	}
	setAppInstance(inst: any) {
		this.instance = inst;
	}
	sendMessage(dest, msg) {
		this.msgObserver.next({ user: dest, msg: msg });
	}
	getCamerasObservable() {
		return this.camObservable;
	}
	getActorsObservable() {
		return this.actObservable;
	}
	getviewerObservable() {
		return this.viewObservable;
	}
	getUsers() {
		let userExceptMe = this.users.filter((us) => { if (us.name !== "me") return true; else false });
		return userExceptMe;
	}
	getAppInstance() {
		return this.instance;
	}
	setNewMessage(msg) {
		if (msg.from != this.getAppInstance().getMyAgentId())
			this.msgObserver.next({ "msg": msg.msg, "user": msg.agentid })
	}
	setLayout(names: any, agentid: string) {
		this.activeLayout = names;
		console.log(this.activeLayout);
		this.instance.setAppAttribute('layout_' + agentid, { layout: this.activeLayout, applyTo: agentid });
	}
	getCleanUrl(url: string) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}
	setActiveShow(name: string) {
		this.activeShow = name;
		this.activeRoom = this.getActiveShow().rooms[0].name;

	}
	getActiveShow(): Show {
		return this.getShowByName(this.activeShow);
	}
	setLanguage(lng: string) {
		let lngObject = this.languages.find(x => { return x.locale == lng });
		this.language = lngObject;
	}
	getLanguage(): any {
		return this.language;
	}
}
