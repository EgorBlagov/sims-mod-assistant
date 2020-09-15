import { createStyles, Theme, withStyles } from "@material-ui/core";
import { WithStyles } from "@material-ui/core/styles/withStyles";
import * as d3 from "d3";
import path from "path";
import React, { createRef } from "react";
import { Translation } from "../../../../../common/l10n";
import { DoubleTypes, IDuplicateGraph } from "../../../../../common/types";
import { doubleTypeMap } from "../../../../utils/language-mapping";
enum NodeType {
    Files = "Files",
    Keys = "Keys",
}
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
        nodeKeyCircle: {
            fill: theme.palette.secondary.main,
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
        labelBorderGroupFiles: {
            fill: "none",
            stroke: theme.palette.primary.main,
            strokeWidth: 2,
            opacity: 0.5,
        },
        labelBorderGroupKeys: {
            fill: "none",
            stroke: theme.palette.secondary.main,
            strokeWidth: 2,
            opacity: 0.5,
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
        const { graph, classes } = this.props;
        const d3Graph = this.createD3Graph(graph);
        const links = d3Graph.links.map((d) => Object.create(d));
        const nodes = d3Graph.nodes.map((d) => Object.create(d));

        const simulation = this.createSimulation(nodes, links);
        const svg = this.createSvg();
        const tooltip = this.createTooltip();
        const link = svg.append("g").attr("class", classes.link).selectAll("line").data(links).join("line");
        const node = this.createNode(svg, nodes, simulation, tooltip);
        simulation.on("tick", () => {
            link.attr("x1", (d) => d.source.x)
                .attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x)
                .attr("y2", (d) => d.target.y);

            node.attr("transform", (d) => `translate(${d.x},${d.y})`);
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
        return [-width, -height, width * 2, height * 2];
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
        const { classes, width, height } = this.props;
        const svg = this.selectRoot().append("svg").attr("viewBox", this.getViewBox()).attr("class", classes.svg);
        const zoom = d3
            .zoom()
            .scaleExtent([1, 2])
            .translateExtent([
                [0, 0],
                [1, 1],
            ])
            .on("zoom", () => {
                svg.attr("transform", d3.event.transform);
            });

        svg.call(zoom)
            .on("mousedown.zoom", null)
            .on("touchstart.zoom", null)
            .on("touchmove.zoom", null)
            .on("touchend.zoom", null)
            .on("dblclick.zoom", null);

        zoom.scaleTo(svg, 2);
        return svg;
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

    private createNode = (svg: any, nodes: any[], simulation: any, tooltip: any) => {
        const { classes, l10n } = this.props;

        const node = svg
            .append("g")
            .selectAll("g")
            .data(nodes)
            .join("g")
            .call(this.getDrag(simulation) as any);

        node.append("circle")
            .attr("class", (d) => (d.type === NodeType.Files ? classes.nodeCircle : classes.nodeKeyCircle))
            .attr("r", (d) => (d.type === NodeType.Files ? 10 : 7))
            .select(function (d) {
                if (d.type === NodeType.Files) {
                    return d.files.length > 1 ? this : null;
                } else {
                    return d.keys.length > 1 ? this : null;
                }
            })
            .clone(true)
            .attr("r", (d) => (d.type === NodeType.Files ? 12 : 9))
            .attr("class", (d) =>
                d.type === NodeType.Files ? classes.labelBorderGroupFiles : classes.labelBorderGroupKeys,
            );

        node.append("text")
            .attr("x", "1em")
            .text((d) => {
                if (d.type === NodeType.Files) {
                    return d.files.length === 1 ? path.basename(d.files[0]) : l10n.fileGroup(d.files.length);
                } else {
                    const types: DoubleTypes[] = Array.from(new Set(d.keys.map((k) => d.typeByKey[k])));
                    return l10n.keyGroup(
                        d.keys.length,
                        types.map((t) => doubleTypeMap[t](l10n).title),
                    );
                }
            })
            .clone(true)
            .lower()
            .attr("class", classes.labelBorder);

        node.on("mouseover", (d) => {
            if (d.type === NodeType.Files && d.files.length === 1) {
                return;
            }

            tooltip.transition().duration(200).style("opacity", 1).style("pointer-events", "all");

            const rootRect = this.d3RootRef.current.getBoundingClientRect();
            const labelRect = d3.event.target.getBoundingClientRect();
            const x = labelRect.x + labelRect.width - rootRect.left;
            const y = labelRect.y + labelRect.height - rootRect.top;

            const textLines = [];
            if (d.type === NodeType.Files) {
                textLines.push(...d.files.map((f) => path.basename(f)));
            } else {
                textLines.push(l10n.conflictKeysDescription);
                textLines.push(...d.keys.map((k) => `${k} ${doubleTypeMap[d.typeByKey[k]](l10n).title}`));
            }
            tooltip.html(textLines.join("<br/>")).style("left", `${x}px`).style("top", `${y}px`);
        }).on("mouseout", () => {
            tooltip.transition().duration(200).delay(200).style("opacity", 0).style("pointer-events", "none");
        });

        return node;
    };

    private createD3Graph(graph: IDuplicateGraph) {
        const added = new Set();
        const result = {
            nodes: [],
            links: [],
        };

        const encoded = {};
        let lastId = 0;
        const encode = (data: string): string => {
            if (!(data in encoded)) {
                encoded[data] = lastId++;
            }
            return encoded[data];
        };
        const toKey = (data: string[]): string => data.sort().join(",");

        for (const { fileGroups, keys } of graph.edgeGroups) {
            const keyGroupName = toKey(keys.map((k) => encode(k)));
            const typeByKey = {};

            for (const key of keys) {
                typeByKey[key] = graph.typeByKey[key];
            }

            result.nodes.push({
                path: keyGroupName,
                type: NodeType.Keys,
                keys,
                typeByKey,
            });

            for (const fileGroup of fileGroups) {
                const groupName = toKey(fileGroup.map((f) => encode(f)));
                if (!added.has(groupName)) {
                    result.nodes.push({
                        type: NodeType.Files,
                        path: groupName,
                        files: fileGroup,
                    });

                    added.add(groupName);
                }

                result.links.push({
                    source: groupName,
                    target: keyGroupName,
                });
            }
        }

        return result;
    }

    render() {
        const { height, width, classes } = this.props;
        return <div style={{ height, width }} className={classes.container} ref={this.d3RootRef} />;
    }
}

export const D3Graph = withStyles(styles)(D3GraphImpl);
