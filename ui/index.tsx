import * as React from "react";
import * as ReactDOM from "react-dom";
import { ipc } from "../common/ipc";
import { Test } from "tslint";

interface IState {
    queriedInfo: string;
    systemInfo: string;
}

class App extends React.Component<{}, IState> {
    state: IState = {
        queriedInfo: "Not fetched",
        systemInfo: "Non fetched",
    };

    componentDidMount() {
        ipc.renderer.testRPC().then((data) => {
            this.setState({ queriedInfo: JSON.stringify(data) });
        });

        ipc.renderer.testRPCSytemInfo(10).then((data) => {
            this.setState({ systemInfo: data });
        });
    }

    render() {
        return (
            <div>
                Fetched API test: {this.state.queriedInfo}
                <br />
                System info: {this.state.systemInfo}{" "}
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
