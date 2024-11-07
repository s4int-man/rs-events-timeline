"use client";

import { Chart, registerables } from "chart.js";
import React from "react";
import 'chartjs-adapter-date-fns';
import annotationPlugin from 'chartjs-plugin-annotation';
import { tomorrow, yesterday } from "@/app/utils/parse";
import { IEvent } from "@/app/types/IEvent";

Chart.register(...registerables, annotationPlugin);
const colors = ["#425E17", "#324AB2", "#FFCA86", "#53377A", "#00677E", "#531A50", "#CD9575", "#78DBE2", "#32CD32", "#90EE90", "#FAEEDD", "#48D1CC", "#297a42", "#FFFF99", "#BEF574", "#E34234", "#34C924", "#F39F18", "#87CEFA"];

const colorTypeMap = new Map<string, string>();
colorTypeMap.set("offers/chain/24", "#414BB2");
colorTypeMap.set("offers/chain/25", "#FAC710");
colorTypeMap.set("offers/one_plus_one", "#8FD14F");
colorTypeMap.set("double_offer_reward", "#8FD14F");
colorTypeMap.set("passion_pass", "#DA0063");
colorTypeMap.set("club_competition_reward", "#2D9BF0");
colorTypeMap.set("gifts_half_price", "#626ABC");
colorTypeMap.set("ghost_hunt", "#7F51BD");
colorTypeMap.set("candy_shop", "#7F51BD");
colorTypeMap.set("leaderboard/ghost_hunt", "#7F51BD");
colorTypeMap.set("gift_league_points/happy_hours", "#2D9BF0");



export function EventChart(props: { events: IEvent[] })
{
	const ref = React.useRef<HTMLCanvasElement>(null);

	const datasets = props.events.map((event, index) =>
	{
		const eventId: string = event.type + (event.subtype != null ? "/" + event.subtype : "") + (event.v != null ? "/" + event.v : "");

		return {
			label: eventId,
			data: { [eventId]: [event.start, event.finish] },
			backgroundColor: colorTypeMap.has(eventId) ? colorTypeMap.get(eventId) : colors[index] ?? "red",
		};
	});

	React.useEffect((): void =>
	{
		if (ref.current === null)
			return;

		const ctx: CanvasRenderingContext2D = ref.current.getContext('2d') as CanvasRenderingContext2D;

		new Chart(ctx, {
			type: 'bar',
			data: {
				datasets
			},
			options: {
				responsive: false,
				indexAxis: 'y',
				plugins: {
					legend: {
						position: 'top',
						display: false
					},
					title: {
						display: true,
						text: 'График включения игровых событий'
					},
					tooltip: {
						callbacks: {
							beforeLabel: (item) => {
								const start = (item.parsed["_custom"] as { start: number }).start;
								return "Начало: " + new Date(start);
							},
							label: () => "",
							afterLabel: (item) => {
								const end = (item.parsed["_custom"] as { end: number }).end;
								return "Конец: " + new Date(end);
							}
						}
					},
					annotation: {
						annotations: {
							"now": {
								type: 'line',
								scaleID: 'x',
								value: Date.now(),
								borderColor: 'red',
								borderWidth: 2,
							}
						}
					}
				},
				scales: {
					y: {
						stacked: true
					},
					x: {
						type: 'time',
						time: {
							// Luxon format string
							parser: 'dd/MM/yyyy HH:mm:ss',
							unit: "hour",
							tooltipFormat: 'DD T',
							displayFormats: {
								'hour': "dd/MM/yyyy HH:mm:ss"
							},
						},
						min: yesterday,
						max: tomorrow
					}
				}
			}
		});
	}, [datasets]);

	return <div className="chart-view">
		<canvas id="chart" width="1850" height="500" ref={ref} />
	</div>;
}