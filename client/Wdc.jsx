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

        if (!!this.props.endPoint){
            //Clean endpoint from cookie
            Cookies.remove('endPoint');
            //reset cookie
            Cookies.set('endPoint', nextProps.endPoint);
        }
        this.handleClick = () => {window.location.href = nextProps.authRedirect}

        // Create the connector object
        this.connector = tableau.makeConnector();
        this.connector.init = (cb) => {
            tableau.authType = this.props.authType || tableau.authTypeEnum.basic;

            var pw = this.getPassword();
            if (tableau.phase == tableau.phaseEnum.gatherDataPhase){
                tableau.password = pw;
                cb();
            }

            // If we are not in the data gathering phase, we want to store the token
            // This allows us to access the token in the data gathering phase
            if (tableau.phase == tableau.phaseEnum.interactivePhase || tableau.phase == tableau.phaseEnum.authPhase) {
                if (this.props.hasAuth || true){
                    tableau.password = pw;
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

            tableau.abortWithError(String(endPoint)+" "+ String(tableau.pasword));
            fetch(endPoint, {credentials:'same-origin'})
            .then(data => {
                table.appendRows(this.props.gatherCallback(data));
                doneCallback()
            })
        }
        //do any on click functionality user provides, then submit
        tableau.registerConnector(this.connector);
    }

    getPassword() {
        var cookie = Cookies.get("password");
        var password = ""
        if (!!cookie) {
            password = cookie;
        } else if (!!tableau && !! tableau.password && tableau.password.length > 0){
            password = tableau.password;
        }

        return password;
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.authRedirect && !nextProps.hasAuth){
            this.handleClick = () => {window.location.href = nextProps.authRedirect}
        } else{
            this.handleClick = event => {
                if (this.props.handleClick){
                    this.props.handleClick();
                }
                tableau.connectionName = this.props.connectionName || "connection";
                tableau.submit();
            };

        }

        if (!!nextProps.endPoint){
            //Clean endpoint from cookie
            Cookies.remove('endPoint');
            //reset cookie
            Cookies.set('endPoint', nextProps.endPoint);
        }
        console.log(Cookies.get('endPoint'));
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
