"use client";

import { Chart, registerables } from "chart.js";
import React from "react";
import 'chartjs-adapter-date-fns';
import { tomorrow, yesterday } from "@/app/utils/parse";
import { IEvent } from "@/app/types/IEvent";

Chart.register(...registerables);
const colors = [ "#425E17", "#324AB2", "#FFCA86", "#53377A", "#00677E", "#531A50", "#CD9575", "#78DBE2", "#32CD32", "#90EE90", "#FAEEDD", "#48D1CC", "#297a42", ];

export function EventChart(props: { events: IEvent[] })
{
    const ref = React.useRef<HTMLCanvasElement>(null);

    console.log(props.events);
    // const labels: string[] = props.events.map(event => event.type + (event.subtype != null ? " (" + event.subtype + ")" : ""));
    // const labels: string[] = props.events.map(event => event.type);

    const datasets = props.events.map((event, index) => ({
        label: event.type + (event.subtype != null ? " (" + event.subtype + ")" : ""),
        data: {[event.type + (event.subtype != null ? " (" + event.subtype + ")" : "")]: [event.start, event.finish]},
        backgroundColor: colors[index] ?? "red",
    }));
	
    React.useEffect(() =>
    {
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
                },
                title: {
                  display: true,
                  text: 'График включения игровых событий'
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
                    parser: 'MM/DD/YYYY HH:mm',
                    tooltipFormat: 'll HH:mm',
                    unit: "hour"
                  },
                  min: yesterday,
                  max: tomorrow
                }
              }
            }
          });
    }, [ datasets ]);

    return <div className="chart-view">
        <canvas id="chart" width="1000" height="500" ref={ref} />
    </div>;
}