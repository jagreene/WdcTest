//Outside
import React, { Component } from 'react';
import tableau from "./lib/tableau"

//Components
//Styling
import styles from './styles.scss';
import classNames from 'classnames';

class Wdc extends Component{

    constructor(props) {
        super(props);
        this.connector = tableau.makeConnector();
        this.connector.getSchema = cb => {
            cb({
                id: this.props.id || "tableId",
                alias: this.props.alias || "tableAlias",
                column: this.props.cols || []
            })
        };
        this.connector.getData = this.props.getData;
        tableau.registerConnector(this.connector);

        this.handleClick = event => {
            if (this.props.handleClick){
                this.props.handleClick();
            }
            tableau.connectionName = this.props.connectionName;
            tableau.submit();
        };
    }

    render() {
        return (
            <div
                className={styles.wdc}
                onClick={this.handleClick}
            >
                {this.props.text}
            </div>
        );
    }
}

export default Wdc;
