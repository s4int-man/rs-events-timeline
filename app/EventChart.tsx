"use client";

import { Chart, registerables } from "chart.js";
import React from "react";
import 'chartjs-adapter-date-fns';
import "chartjs-plugin-annotation";
import { tomorrow, yesterday } from "@/app/utils/parse";
import { IEvent } from "@/app/types/IEvent";

Chart.register(...registerables);
const colors = ["#425E17", "#324AB2", "#FFCA86", "#53377A", "#00677E", "#531A50", "#CD9575", "#78DBE2", "#32CD32", "#90EE90", "#FAEEDD", "#48D1CC", "#297a42", "#FFFF99", "#BEF574", "#E34234", "#34C924", "#F39F18", "#87CEFA"];

export function EventChart(props: { events: IEvent[] }) {
	const ref = React.useRef<HTMLCanvasElement>(null);

	// const labels: string[] = props.events.map(event => event.type + (event.subtype != null ? " (" + event.subtype + ")" : ""));
	// const labels: string[] = props.events.map(event => event.type);

	const datasets = props.events.map((event, index) => ({
		label: event.type + (event.subtype != null ? " (" + event.subtype + ")" : ""),
		data: { [event.type + (event.subtype != null ? " (" + event.subtype + ")" : "")]: [event.start, event.finish] },
		backgroundColor: colors[index] ?? "red",
	}));

	React.useEffect(() => {
		if (ref.current === null)
			return;

		const ctx = ref.current.getContext('2d')!;

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
								return "Начало: " + new Date(start) + "; " + start;
							},
							label: () => "",
							afterLabel: (item) => {
								const end = (item.parsed["_custom"] as { end: number }).end;
								return "Конец: " + new Date(end) + "; " + end;
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
								borderWidth: 2
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