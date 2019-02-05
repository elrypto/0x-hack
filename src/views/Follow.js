import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ToastProvider, withToastManager } from 'react-toast-notifications';
import Header from './../components/Header';
import Footer from './../components/Footer';


class Follow extends React.Component {
     
    render() {
        //const ZeroExActionsWithNotifications = withToastManager(ZeroExMultiBuyAction);

        //if (!this.state || !this.state.contractWrappers || !this.state.web3Wrapper) {
        //    return <div />;
        //}

        return (
            <div>
                  <Header />
                  <Footer />
            </div>          
        )
    }
}

export default Follow;

