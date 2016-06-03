//Outside
import React, { Component } from 'react';
// import tableau from "./lib/tableau"

//Components
//Styling
import styles from './styles.scss';
import classNames from 'classnames';

class Wdc extends Component{

    constructor(props) {
        super(props);
        // Create the connector object
        this.connector = tableau.makeConnector();
        // this.connector.init = (cb) => {
        //     tableau.authType = this.props.authType || tableau.authTypeEnum.basi;

        //     cb();

        //     // If we are not in the data gathering phase, we want to store the token
        //     // This allows us to access the token in the data gathering phase
        //     if (tableau.phase == tableau.phaseEnum.interactivePhase || tableau.phase == tableau.phaseEnum.authPhase) {
        //         if (this.props.hasAuth || true){
        //             if (tableau.phase == tableau.phaseEnum.authPhase) {
        //                 // Auto-submit here if we are in the auth phase
        //                 tableau.submit()
        //             }
        //             return;
        //         }

        //     }
        // }

        //define schema getter
        this.connector.getSchema = (cb) => {
            let tableInfo = {
                id: this.props.id || "tableId",
                alias: this.props.alias || "tableAlias",
                columns: this.props.cols || []
            };

            console.log(tableInfo);
            cb([tableInfo]);
        };

        //attach user function for getting data
        this.connector.getData = this.props.getData;
        //do any on click functionality user provides, then submit
        this.handleClick = event => {
            if (this.props.handleClick){
                this.props.handleClick();
            }
            tableau.connectionName = this.props.connectionName || "connection";
            tableau.submit();
        };
        tableau.registerConnector(this.connector);
    }

    render() {
        return (
            <div
                className={styles.wdc}
                id="submitBtn"
                onClick={this.handleClick}
            >
                {this.props.text}
            </div>
        );
    }
}

export default Wdc;
