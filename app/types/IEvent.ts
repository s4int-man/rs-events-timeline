export interface IEventRaw
{
    start: string;
    finish: string;
    type: string;
    subtype?: string;
    v?: number;
}

export interface IEvent
{
    start: Date;
    finish: Date;
    type: string; // Потом указать объединение
    subtype?: string;
    v?: number;
}

export interface IEventsConfig
{
    events: IEventRaw[];
}