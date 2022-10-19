/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import { Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatAdapter, ChatParticipantStatus, ChatParticipantType, IChatController, Message, Theme } from 'ng-chat';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MyAdapter } from 'src/app/layout/controls/MyAdapter.class';
import { MessageInt } from './messages';
import { Orkestra } from 'orkestraLib';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-chat-mobile',
  templateUrl: './chat-mobile.component.html',
  styleUrls: ['./chat-mobile.component.css']
})
export class ChatMobileComponent implements OnInit {

  messages$!: Observable<Message[]>;
  selectedId = 0;
  @Output()
  closeChatParent = new EventEmitter();
  @Output()
  openChatParent = new EventEmitter();
  @ViewChild('ngChatInstance') protected ngChatInstance!: IChatController;
  userId = 999;
  @Input()
  app: Orkestra;
  public adapter: ChatAdapter;
  theme = Theme;
  BORDER_SIZE = 4;
  panel: any;
  title = "Users";
  themeAct: Theme = Theme.Dark;

  m_pos: any = "";
  grabber = false;
  oldMsg: any;
  actMsgs: any = [];
  oldFrom: any;


  constructor(private elRef: ElementRef, private dataService: DataService) {


  }

  ngOnInit(): void {
    this.app.userObservable.subscribe(z => {
      this.dataService.setUsers(this.app.getUsers());
      if (z.data.key == 'message' && z.data.value != "undefined" && z.data.value != '') {
        if (z.data.agentid == this.app.getMyAgentId() || z.data.value.from == this.app.getMyAgentId()) {
          
          if ((this.oldFrom != z.data.value.from || this.oldMsg != z.data.value.msg)) {
            this.oldFrom = z.data.value.from;
            this.oldMsg = z.data.value.msg;

            if (z.data.value.from != this.app.getMyAgentId() && z.data.value.msg !== undefined) this.actMsgs.push("ADMIN: " + z.data.value.msg);
                 
          }
        }
           
      }
      this.clean()
      setTimeout(()=>{
        document.querySelector('.listMessage').scrollTop=document.querySelector('.listMessage').scrollHeight
      },200)
    });
  }
  closeChat() {
    this.elRef.nativeElement.querySelector('.wrapperContent').classList.add('dontShow')
    this.elRef.nativeElement.querySelector('.open').classList.add('show')
    this.elRef.nativeElement.querySelector('.open').classList.remove('dontShow')

    this.closeChatParent.emit()
  }

  openChat() {
    this.elRef.nativeElement.querySelector('.wrapperContent').classList.remove('dontShow')
    this.elRef.nativeElement.querySelector('.open').classList.remove('show')
    this.elRef.nativeElement.querySelector('.open').classList.add('dontShow')

    this.openChatParent.emit()
  }

  onKeydownEvent(e: any) {
    e.target.style.height = "46px";
    e.target.style.height = e.target.scrollHeight + 4 + "px";
    if (e.key === 'Enter') {
      let admin = this.dataService.getUsers().find((usr) => {
        if (usr[1]) usr = usr[1];
        return usr.capacities.userProfile === "admin";
      })
      if (admin) {
        this.app.setUserContextData(admin.id || admin[0] , 'message', { msg: e.srcElement.value, from: this.app.getMyAgentId() });
        this.actMsgs.push("Me: " + e.srcElement.value);
        

      }
      else alert("not admin connected");

      setTimeout(() => {
        this.elRef.nativeElement.querySelector('textarea').innerHTML = "";
        this.elRef.nativeElement.querySelector('textarea').value = "";
        this.elRef.nativeElement.querySelector('textarea').style.height = "auto";
        document.querySelector('.listMessage').scrollTop=document.querySelector('.listMessage').scrollHeight
      }, 150);
    }
  }
  sendMessage(evt: any) {
    let admin = this.dataService.getUsers().find((usr) => {
      if (usr[1]) usr = usr[1];
      return usr.capacities.userProfile === "admin";
    })
    if (admin) {
      this.app.setUserContextData(admin.id || admin[0], 'message', { msg: this.elRef.nativeElement.querySelector('.inputContainer textarea').value, from: this.app.getMyAgentId() });
      this.actMsgs.push("Me: " + this.elRef.nativeElement.querySelector('.inputContainer textarea').value);
     
    }
    else alert("not admin connected");

    setTimeout(() => {
      this.elRef.nativeElement.querySelector('textarea').innerHTML = "";
      this.elRef.nativeElement.querySelector('textarea').value = "";
      this.elRef.nativeElement.querySelector('textarea').style.height = "auto";
      document.querySelector('.listMessage').scrollTop=document.querySelector('.listMessage').scrollHeight
    }, 150);
  }
  autoGrowTextZone(e: any) {

  }
  isMe(msg: string) {
    if (msg.includes('Me')) return true;
    else return false;
  }
  clean() {
    this.actMsgs = this.actMsgs.filter((msg) => {
      if (msg) return true;
      else return false;
    })
  }

}
