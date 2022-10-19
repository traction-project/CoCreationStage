/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import { MessageInt } from "./messages";

export const MESSAGES: MessageInt[] = [
    {
        id:0,
        author:"admin",
        message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        tail: 1
      },
      {
        id:1,
        author:"admin",
        message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        tail: 0
      },
      {
        id:2,
        author:"null",
        message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        tail: 1
      },
      {
        id:3,
        author:"admin",
        message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
        tail: 1
      },
      {
        id:4,
        author:"null",
        message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        tail: 1
      }
]