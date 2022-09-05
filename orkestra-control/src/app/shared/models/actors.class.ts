export class Actors {

    actors = Actors;

    trackActor(index, actor) {
        console.log(actor);
        return actor ? actor.id : undefined;

    }


}