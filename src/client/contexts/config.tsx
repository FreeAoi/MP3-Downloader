import React, { createContext, useEffect } from 'react';

interface IContext {
    downloadsDirectory: string;
}

export const ConfigContext = createContext<IContext>({
    downloadsDirectory: ''
});

export default class ConfigProvider extends React.Component {
    state = {
        downloadsDirectory: ''
    } as IContext;

    componentDidMount() {
        window['MP3DownloaderAPI'].requestConfig();
        window['MP3DownloaderAPI'].onConfigUpdate(this.updateConfig.bind(this));
    }

    updateConfig(_, newConfig: IContext) {
        this.setState({
            ...this.state,
            ...newConfig
        });
    }

    render() {
        return (<ConfigContext.Provider value={this.state}>
            {this.props.children}
        </ConfigContext.Provider>);
    }
}