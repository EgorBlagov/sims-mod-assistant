import { withStyles } from "@material-ui/core";
import * as d3 from "d3";
import _ from "lodash";
import path from "path";
import React, { createRef } from "react";
import { IDuplicateGraph } from "../../../../../common/types";

interface IOwnProps {
    graph: IDuplicateGraph;
    height: number;
    width: number;
}

interface IPropsFromStyles {
    classes: {
        [K in keyof ReturnType<typeof styles>]: string;
    };
}

interface IProps extends IOwnProps, IPropsFromStyles {}

const styles = (theme) => ({
    node: {
        fill: theme.palette.primary.main,
    },
});

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

        const { graph: data, width, height, classes } = this.props;

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
                .style("font", "12px sans-serif");

            const link = svg
                .append("g")
                .attr("stroke", "#999")
                .attr("stroke-width", 1.5)
                .attr("stroke-opacity", 0.6)
                .selectAll("line")
                .data(links)
                .join("line")
                .attr("stroke", "black");

            const linkLabel = svg.append("g").selectAll("g").data(links).join("g");

            linkLabel
                .append("text")
                .attr("x", 0)
                .attr("y", 0)
                .text((d) => d.types.join(","));

            const node = svg
                .append("g")
                .attr("fill", "currentColor")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .selectAll("g")
                .data(nodes)
                .join("g")
                .call(drag(simulation));

            node.append("circle")
                .attr("class", classes.node)

                .attr("stroke", "white")
                .attr("stroke-width", 1.5)
                .attr("r", 10);

            node.append("text")
                .attr("font-size", "1.5em")
                .attr("x", 8)
                .attr("y", "0.31em")
                .text((d) => path.basename(d.path))
                .clone(true)
                .lower()
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("stroke-width", 3);

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

    shouldComponentUpdate(nextProps: IProps) {
        return _.isEqual(this.props.graph, nextProps.graph);
    }

    render() {
        const { height, width } = this.props;

        return <div style={{ height, width }} ref={this.d3RootRef} />;
    }
}

export const D3Graph = withStyles(styles)(D3GraphImpl);
