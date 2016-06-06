//Outside
import React, { Component } from 'react';
import Cookies from 'js-cookie';
// import tableau from "./lib/tableau"

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

            //store endpoint in cookie if available so it is accesible in all phases
            if(this.props.endPoint != null){
                //Clean endpoint from cookie
                Cookies.remove('endPoint');
                //reset cookie
                Cookies.set('endPoint', this.props.endPoint);
            }

            if(tableau.phase == tableau.phaseEnum.gatherDataPhase){
                cb();
            }

            // If we are not in the data gathering phase, we want to store the token
            // This allows us to access the token in the data gathering phase
            if (tableau.phase == tableau.phaseEnum.interactivePhase || tableau.phase == tableau.phaseEnum.authPhase) {
                if (this.props.hasAuth || true){
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
            let tableInfo = {
                id: this.props.id || "tableId",
                alias: this.props.alias || "tableAlias",
                columns: this.props.cols || []
            };

            // tableau.abortWithError(`ID: ${tableInfo.id}, Alias: ${tableInfo.alias}, Columns: ${tableInfo.columns}`);
            cb([tableInfo]);
        };

        //attach user function for getting data
        this.connector.getData = (table, doneCallback) => {
            //retrieve endpoint from cookie
            let endPoint = Cookies.get('endPoint');
            //Clean endpoint from cookie
            Cookies.remove('endPoint');

            tableau.abortWithError(String(endPoint)+"new");
            fetch(endPoint, {credentials:'same-origin'})
            .then(data => {
                table.appendRows(this.props.gatherCallback(data));
                doneCallback()
            })
        }
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

        console.log(Cookies.get('endPoint'));
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
