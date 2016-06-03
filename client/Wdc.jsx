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
        this.connector.init = (cb) => {
            tableau.authType = this.props.authType || tableau.authTypeEnum.basic;

            if(tableau.phase == tableau.phaseEnum.gatherDataPhase){
                if(!this.props.hasAuth){
                    tableau.abortWithError(this.props.hasAuth);
                }
                tableau.password="test";
                cb();
            }

            // If we are not in the data gathering phase, we want to store the token
            // This allows us to access the token in the data gathering phase
            if (tableau.phase == tableau.phaseEnum.interactivePhase || tableau.phase == tableau.phaseEnum.authPhase) {
                if (this.props.hasAuth || true){
                    tableau.password="test";
                    cb();
                    if (tableau.phase == tableau.phaseEnum.authPhase) {
                        // Auto-submit here if we are in the auth phase
                        tableau.submit()
                    }
                    return;
                }
            }
        }

        //define schema getter
        this.connector.getSchema = (cb) => {
            var cols = [{
                id: "mag",
                alias: "magnitude",
                dataType: tableau.dataTypeEnum.float
                }, {
                id: "title",
                alias: "title",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "url",
                alias: "url",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "lat",
                alias: "latitude",
                dataType: tableau.dataTypeEnum.float
            }, {
                id: "lon",
                alias: "longitude",
                dataType: tableau.dataTypeEnum.float
            }];

            var tableInfo = {
                id: "earthquakeFeed",
                alias: "Earthquakes with magnitude greater than 4.5 in the last seven days",
                columns: cols
            };

            // let tableInfo = {
            //     id: this.props.id || "tableId",
            //     alias: this.props.alias || "tableAlias",
            //     columns: this.props.cols || []
            // };

            cb([tableInfo]);
        };

        //attach user function for getting data
        this.connector.getData = this.props.getData;
        //do any on click functionality user provides, then submit
        tableau.registerConnector(this.connector);
    }

    render() {
        if (this.props.authRedirect && !this.props.hasAuth){
            this.handleClick = () => {window.location.href = this.props.authRedirect}
        } else{
            this.handleClick = event => {
                if (this.props.handleClick){
                    this.props.handleClick();
                }
                tableau.connectionName = this.props.connectionName || "connection";
                tableau.submit();
            };

        }
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
