import { IEvent, IEventRaw } from "@/app/types/IEvent";

export const yesterday = new Date().setDate(new Date().getDate() - 1);
export const tomorrow = new Date().setDate(new Date().getDate() + 7);

export function parseEvent(data: IEventRaw): IEvent | null
{
    const start: number = Date.parse(data.start + "+03:00");
    const finish: number = Date.parse(data.finish + "+03:00");

    console.log(start, finish, "BY UTC");

    if (finish < yesterday)
        return null;

    if (start > tomorrow)
        return null;

    return {
        start: new Date(start), 
        finish: new Date(finish),
        type: data.type,
        subtype: data.subtype
    };
}