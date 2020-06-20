import { createStyles, Theme, withStyles } from "@material-ui/core";
import { WithStyles } from "@material-ui/core/styles/withStyles";
import * as d3 from "d3";
import path from "path";
import React, { createRef } from "react";
import { Translation } from "../../../../../common/l10n";
import { IDuplicateGraph } from "../../../../../common/types";

const styles = (theme: Theme) =>
    createStyles({
        container: {
            overflow: "hidden",
            position: "relative",
            whiteSpace: "nowrap",
        },
        nodeCircle: {
            fill: theme.palette.primary.main,
            cursor: "pointer",
            stroke: "white",
            strokeWidth: 1.5,
        },
        linkLabel: {
            fontSize: "0.75em",
            fontWeight: 700,
            fill: theme.palette.text.secondary,
            textAnchor: "middle",
        },
        labelBorder: {
            fill: "none",
            stroke: "white",
            strokeWidth: 3,
        },
        tooltip: {
            position: "absolute",
            textAlign: "center",
            padding: theme.spacing(1),
            fontFamily: "monospace",
            background: theme.palette.text.secondary,
            borderRadius: theme.shape.borderRadius,
            color: "white",
            pointerEvents: "none",
            userSelect: "text",
        },
        link: {
            stroke: theme.palette.text.secondary,
            strokeWidth: 1.5,
            strokeOpacity: 0.6,
        },
    });

interface IProps extends WithStyles<typeof styles> {
    graph: IDuplicateGraph;
    height: number;
    width: number;
    l10n: Translation;
}

export class D3GraphImpl extends React.Component<IProps> {
    private d3RootRef = createRef<HTMLDivElement>();

    componentDidMount() {
        const drag = (simulation) => {
            const dragstarted = (d) => {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            };

            const dragged = (d) => {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            };

            const dragended = (d) => {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            };

            return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
        };

        const { graph: data, width, height, classes, l10n } = this.props;

        const chart = (mountpoint) => {
            const links = data.links.map((d) => Object.create(d));
            const nodes = data.nodes.map((d) => Object.create(d));

            const simulation = d3
                .forceSimulation(nodes)
                .force(
                    "link",
                    d3.forceLink(links).id((d: any) => d.path),
                )
                .force("charge", d3.forceManyBody().strength(-5000))
                .force("x", d3.forceX())
                .force("y", d3.forceY());

            const svg = mountpoint
                .append("svg")
                .attr("viewBox", [-width / 2, -height / 2, width, height])
                .style("font-family", "sans-serif");

            const tooltip = mountpoint
                .append("div")
                .attr("class", classes.tooltip)
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
                .on("mouseover", () => {
                    tooltip.transition().duration(200).style("opacity", 1).style("pointer-events", "all");
                })
                .on("mouseout", () => {
                    tooltip.transition().duration(200).style("opacity", 0).style("pointer-events", "none");
                });

            const link = svg.append("g").attr("class", classes.link).selectAll("line").data(links).join("line");

            const node = svg.append("g").selectAll("g").data(nodes).join("g").call(drag(simulation));

            node.append("circle").attr("class", classes.nodeCircle).attr("r", 10);

            node.append("text")
                .attr("x", "1em")
                .text((d) => path.basename(d.path))
                .clone(true)
                .lower()
                .attr("class", classes.labelBorder);

            const linkLabel = svg.append("g").selectAll("g").data(links).join("g");

            linkLabel
                .append("text")
                .attr("x", 0)
                .attr("y", 0)
                .attr("class", classes.linkLabel)
                .text((d) => d.types.join(", "))
                .on("mouseover", (d) => {
                    tooltip.transition().duration(200).style("opacity", 1).style("pointer-events", "all");

                    const rootRect = this.d3RootRef.current.getBoundingClientRect();
                    const labelRect = d3.event.target.getBoundingClientRect();
                    const x = labelRect.x + labelRect.width - rootRect.left;
                    const y = labelRect.y + labelRect.height - rootRect.top;
                    tooltip
                        .html(d.keys.join("<br/>"))
                        .style("left", x + "px")
                        .style("top", y + "px");
                })
                .on("mouseout", () => {
                    tooltip.transition().duration(200).delay(200).style("opacity", 0).style("pointer-events", "none");
                });

            linkLabel
                .selectAll("text")
                .clone(true)
                .lower()
                .attr("class", [classes.labelBorder, classes.linkLabel].join(" "));

            simulation.on("tick", () => {
                link.attr("x1", (d) => d.source.x)
                    .attr("y1", (d) => d.source.y)
                    .attr("x2", (d) => d.target.x)
                    .attr("y2", (d) => d.target.y);
                node.attr("transform", (d) => `translate(${d.x},${d.y})`);
                linkLabel.attr(
                    "transform",
                    (d) => `translate(${(d.source.x + d.target.x) / 2},${(d.source.y + d.target.y) / 2})`,
                );
            });

            return svg.node();
        };

        const vis = d3.select(this.d3RootRef.current);
        chart(vis);
    }

    componentDidUpdate() {
        const { width, height } = this.props;
        d3.select(this.d3RootRef.current)
            .select("svg")
            .attr("viewBox", [-width / 2, -height / 2, width, height] as any);
    }

    render() {
        const { height, width, classes } = this.props;

        return <div style={{ height, width }} className={classes.container} ref={this.d3RootRef} />;
    }
}

export const D3Graph = withStyles(styles)(D3GraphImpl);
