
// Correctly mounts p5 canvas on react. 
// Taken from https://github.com/NeroCor/react-p5-wrapper


import { Component } from 'react';

import { debounce } from 'lodash';


export class RemountOnResize extends Component {
    constructor(props) {
        super(props);

        this.state = {
            resizing: true,
            isPortrait: window.innerHeight > window.innerWidth
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.setResize);
        this.setState({ resizing: false });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setResize);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.watchedVal !== nextProps.watchedVal) {
            this.setState({ resizing: true });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // Yes, this triggers another update.
        // That is the whole point: to cycle between
        // unmounting and remounting upon certain
        // triggers.
        if (!prevState.resizing && this.state.resizing) {
            this.setState({ resizing: false });
        }
    }

    render() {
        return this.state.resizing ? null : this.props.children;
    }
}
