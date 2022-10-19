/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import {
  ChatAdapter,
  ChatParticipantStatus,
  ChatParticipantType,
  Message,
  ParticipantResponse,
  IChatParticipant,
} from "ng-chat";
import { Observable, of, Subject, zip } from "rxjs";
import { DataService } from 'src/app/shared/services/data.service';

export class MyAdapter extends ChatAdapter {
  orkestra: any;
  dataService:DataService;
  messagesHistory: Map<string, Message[]> = new Map<string, Message[]>();
  duplicates: Map<string, Message> = new Map<string, Message>();

  constructor(orkestra: any, dataService:DataService) {
    super();

    this.orkestra = orkestra;
    this.dataService = dataService;
    this.initConnection();
  }

  /**
   * Manage orkestra chat messages
   */
  initConnection() {
    this.orkestra.userObservable.subscribe((event) => {
      if (this.isChatMessage(event)) {
        // Create message from received orkestra data
        let message: Message = new Message();
        message.dateSent = new Date();
        message.message = event.data.value.msg ? event.data.value.msg : "";
        message.fromId = event.data.value.from
          ? event.data.value.from
          : "unknown";
        message.toId = event.data.agentid;

        // orkestra users
        const users = this.getOrkestraUsers();

        // map orkestra users to chat participants
        const participants = this.orkestraToChatParticipants(users);

        // find participant sender
        let fromParticipant = participants.find(
          (participant) => participant.displayName === message.fromId
        );

        if (!fromParticipant) return;

        /**
         * Hack: Orkestra app duplicates some messages ¯\_(ツ)_/¯
         */
        const ptId = fromParticipant.id;
        if (this.messageDuplicated(message, fromParticipant)) {
          this.duplicates.delete(ptId);
          return;
        }

        // save last message to duplicates
        this.duplicates.set(ptId, message);

        // save message in participant history to render them in getMessageHistory
        if (!this.messagesHistory.get(ptId)) {
          this.messagesHistory.set(ptId, []);
        }

        const participantMessages: Message[] = this.messagesHistory.get(ptId);
        participantMessages.push(message);

        this.onMessageReceived(fromParticipant, message);
      }
    });
  }

  isChatMessage(event) {
    return (
      event.data.key === "message" &&
      event.data.value != "undefined" &&
      event.data.value != ""
    );
  }

  getOrkestraUsers() {
    let users = JSON.parse(this.orkestra.getUsers()) || [];

    // filter undefined users
    users = users.filter((user) => typeof user[1].name !== "undefined");

    return users;
  }

  orkestraToChatParticipants(orkestraUsers) {
    return orkestraUsers.map((user: [string, any]) => {
      const [userName, userInfo] = user;

      const participant: IChatParticipant = {
        participantType: ChatParticipantType.User,
        id: userInfo.agentid,
        displayName: userName,
        avatar: "https://lh3.googleusercontent.com/a/default-user=s64",
        status: ChatParticipantStatus.Online,
      };

      return participant;
    });
  }

  messageDuplicated(message: Message, participant: IChatParticipant) {
    const participantlastMsg = this.duplicates.get(participant.id);
    return participantlastMsg && participantlastMsg.message === message.message;
  }

  listFriends(): Observable<ParticipantResponse[]> {
    // get users from orkestra
    const users: [] = this.getOrkestraUsers();

    // Filter myAgent and Devices without chat feature (basically removing all viewers with type = "device" )
    const deviceUsersIds = this.dataService.getViewerTypeDev();
    const usersWithChat = users.filter((user: [string, any]) => {
      const [userName, userInfo] = user;    
      const agentId = userInfo.agentid || "";
      const userHasChat = !deviceUsersIds.some(deviceId => deviceId === agentId);
      return userHasChat && agentId !== this.orkestra.getMyAgentId();
    });

    // map user to participantResponse
    const participants = this.orkestraToChatParticipants(usersWithChat);
    const participantResponses = participants.map(
      (participant: IChatParticipant) => {
        const participantResponse = new ParticipantResponse();
        participantResponse.participant = participant;
        participantResponse.metadata = {
          totalUnreadMessages: 0,
        };

        return participantResponse;
      }
    );

    /**
     * Sort participants by messages sent dates
     */
    participantResponses.sort((ptRA, ptRB) => {
      const ptA = ptRA.participant;
      const ptB = ptRB.participant;

      const ptALastMessages = this.messagesHistory.get(ptA.id);
      const ptBLastMessages = this.messagesHistory.get(ptB.id);

      if (ptALastMessages && !ptBLastMessages) return -1;
      if (!ptALastMessages && ptBLastMessages) return 1;

      if (ptALastMessages && ptBLastMessages) {
        const lastptAMessage = ptALastMessages[ptALastMessages.length - 1];
        const lastptBMessage = ptBLastMessages[ptBLastMessages.length - 1];

        const lastptAMessageDate = new Date(lastptAMessage.dateSent);
        const lastptBMessageDate = new Date(lastptBMessage.dateSent);

        return lastptAMessageDate <= lastptBMessageDate ? 1 : -1;
      }

      return 0;
    });

    return of(participantResponses);
  }

  getMessageHistory(destinataryId: any): Observable<Message[]> {
    return of(this.messagesHistory.get(destinataryId) || []);
  }

  sendMessage(message: Message): void {
    this.orkestra.setUserContextData(message.toId, "message", {
      msg: message.message,
      from: this.orkestra.getMyAgentId(),
    });
  }
}
