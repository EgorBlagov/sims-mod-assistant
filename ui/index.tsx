import * as React from "react";
import * as ReactDOM from "react-dom";
// tslint:disable-next-line: no-var-requires
const axios = require("axios").default;

const url = new URL(window.location.toString());
const port = Number(url.searchParams.get("port"));

interface IProps {
    port: number;
}

interface IState {
    queriedInfo: string;
}

class App extends React.Component<IProps, IState> {
    state: IState = {
        queriedInfo: "Not fetched",
    };

    componentDidMount() {
        axios.get("/api").then((res) => {
            this.setState({ queriedInfo: JSON.stringify(res.data) });
        });
    }

    render() {
        return (
            <div>
                Fetched API test: {this.state.queriedInfo}
                <br />
                Port: {this.props.port}
            </div>
        );
    }
}

ReactDOM.render(<App port={port} />, document.getElementById("root"));
