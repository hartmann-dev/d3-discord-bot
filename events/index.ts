import { Event } from "../interfaces/Event";
import ready from "./ready";
import interactionCreate from "./interactionCreate";

const events: Event[] = [];
events.push(ready);
events.push(interactionCreate);

export default events;
