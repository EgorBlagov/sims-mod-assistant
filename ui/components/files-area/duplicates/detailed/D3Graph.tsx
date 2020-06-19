import React from "react";
import { IDuplicateGraph } from "../../../../../common/types";

interface IProps {
    graph: IDuplicateGraph;
    height: number;
    width: number;
}

export class D3Graph extends React.Component<IProps> {
    render() {
        const { height, width } = this.props;
        return <div style={{ height, width, textAlign: "center" }}>D3 awesome graph placeholder</div>;
    }
}
