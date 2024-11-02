import { EventChart } from "@/app/EventChart";
import { IEvent, IEventsConfig } from "@/app/types/IEvent";
import { parseEvent } from "@/app/utils/parse";
import { Chart } from "chart.js";
import React from "react";

export default async function Home()
{
	const response: Response = await fetch("https://bottleconf.realcdn.ru/events.json");
	const rs_config: IEventsConfig = await response.json();

	const events = rs_config.events
		.map(data => parseEvent(data))
		.filter((event: IEvent | null): event is IEvent => !!event);

	return <EventChart events={events} />;
}
