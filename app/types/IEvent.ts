export interface IEventRaw
{
    start: string;
    finish: string;
    type: string;
    subtype?: string;
}

export interface IEvent
{
    start: Date;
    finish: Date;
    type: string; // Потом указать объединение
    subtype?: string;
}

export interface IEventsConfig
{
    events: IEventRaw[];
}