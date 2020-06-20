import { createStyles, Theme, withStyles } from "@material-ui/core";
import { WithStyles } from "@material-ui/core/styles/withStyles";
import * as d3 from "d3";
import path from "path";
import React, { createRef } from "react";
import { Translation } from "../../../../../common/l10n";
import { DoubleTypes, IDuplicateGraph } from "../../../../../common/types";
import { doubleTypeMap } from "../../../../utils/language-mapping";

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
        svg: {
            fontFamily: "sans-serif",
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
        const { graph, classes, l10n } = this.props;

        const links = graph.links.map((d) => Object.create(d));
        const nodes = graph.nodes.map((d) => Object.create(d));

        const simulation = this.createSimulation(nodes, links);
        const svg = this.createSvg();
        const tooltip = this.createTooltip();
        const link = svg.append("g").attr("class", classes.link).selectAll("line").data(links).join("line");
        const node = this.createNode(svg, nodes, simulation);
        const linkLabel = this.createLinkLabel(svg, links, tooltip);

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
    }

    componentDidUpdate() {
        this.selectRoot().select("svg").attr("viewBox", this.getViewBox());
    }

    private selectRoot = () => {
        return d3.select(this.d3RootRef.current);
    };

    private getViewBox = (): any => {
        const { width, height } = this.props;
        return [-width / 2, -height / 2, width, height];
    };

    private getDrag = (simulation: any) => {
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

    private createSimulation = (nodes: any[], links: any[]) => {
        return d3
            .forceSimulation(nodes)
            .force(
                "link",
                d3.forceLink(links).id((d: any) => d.path),
            )
            .force("charge", d3.forceManyBody().strength(-5000))
            .force("x", d3.forceX())
            .force("y", d3.forceY());
    };

    private createSvg = () => {
        const { classes } = this.props;
        return this.selectRoot().append("svg").attr("viewBox", this.getViewBox()).attr("class", classes.svg);
    };

    private createTooltip = () => {
        const { classes } = this.props;
        const tooltip = this.selectRoot()
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

        return tooltip;
    };

    private createNode = (svg: any, nodes: any[], simulation: any) => {
        const { classes } = this.props;

        const node = svg
            .append("g")
            .selectAll("g")
            .data(nodes)
            .join("g")
            .call(this.getDrag(simulation) as any);

        node.append("circle").attr("class", classes.nodeCircle).attr("r", 10);

        node.append("text")
            .attr("x", "1em")
            .text((d) => path.basename(d.path))
            .clone(true)
            .lower()
            .attr("class", classes.labelBorder);

        return node;
    };

    private createLinkLabel = (svg: any, links: any[], tooltip: any) => {
        const { classes, l10n } = this.props;
        const linkLabel = svg.append("g").selectAll("g").data(links).join("g");

        linkLabel
            .append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("class", classes.linkLabel)
            .text((d) => {
                const types: DoubleTypes[] = d.types;
                return types.map((t) => doubleTypeMap[t](l10n).title).join(", ");
            })
            .on("mouseover", (d) => {
                tooltip.transition().duration(200).style("opacity", 1).style("pointer-events", "all");

                const rootRect = this.d3RootRef.current.getBoundingClientRect();
                const labelRect = d3.event.target.getBoundingClientRect();
                const x = labelRect.x + labelRect.width - rootRect.left;
                const y = labelRect.y + labelRect.height - rootRect.top;
                tooltip
                    .html(`${l10n.conflictKeysDescription}<br/><br/>${d.keys.join("<br/>")}`)
                    .style("left", `${x}px`)
                    .style("top", `${y}px`);
            })
            .on("mouseout", () => {
                tooltip.transition().duration(200).delay(200).style("opacity", 0).style("pointer-events", "none");
            });

        linkLabel
            .selectAll("text")
            .clone(true)
            .lower()
            .attr("class", [classes.labelBorder, classes.linkLabel].join(" "));

        return linkLabel;
    };

    render() {
        const { height, width, classes } = this.props;
        return <div style={{ height, width }} className={classes.container} ref={this.d3RootRef} />;
    }
}

export const D3Graph = withStyles(styles)(D3GraphImpl);
