import { actions, dispatch } from 'codesandbox-api';
import * as React from 'react';

export class OpenModule extends React.Component {
    render() {
        return <a onClick={this.onClick}> View code.</a>;
    }
    onClick = () => dispatch(actions.editor.openModule(this.props.filePath, this.props.lineNumber));
}
