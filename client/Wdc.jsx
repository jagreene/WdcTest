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

            //grab password from either cookie or tableau.password
            var pw = this.getPassword();
            if (tableau.phase == tableau.phaseEnum.gatherDataPhase){
                tableau.password = pw;
                cb();
            }

            // If we are not in the data gathering phase, we want to store the password
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

            cb([tableInfo]);
        };

        //attach user function for getting data
        this.connector.getData = (table, doneCallback) => {
            //retrieve endpoint from cookie
            let token = Cookies.get('token');
            //Clean endpoint from cookie
            Cookies.remove('token');

            tableau.abortWithError(JSON.stringify(this.props.endPoint)+" "+String(token)+" "+ String(tableau.pasword));
            fetch(this.props.endPoint, {credentials:'same-origin'})
            .then(data => {
                table.appendRows(this.props.gatherCallback(data));
                doneCallback()
            })
        }

        tableau.registerConnector(this.connector);

        //set onClick of button
        if (nextProps.authRedirect && !nextProps.hasAuth){
            this.handleClick = () => {window.location.href = nextProps.authRedirect}
        } else {
            this.handleClick = event => {
                if (this.props.handleClick){
                    this.props.handleClick();
                }
                tableau.connectionName = this.props.connectionName || "connection";
                tableau.submit();
            };
        }

    }

    getPassword() {
        //get password from cookie first
        var cookie = Cookies.get("token");
        var password = ""
        if (!!cookie) {
            password = cookie;
        } else if (!!tableau && !! tableau.password && tableau.password.length > 0){
            password = tableau.password;
        }

        return password;
    }

    componentWillReceiveProps(nextProps){
        //check if button usage has changed
        if (nextProps.authRedirect && !nextProps.hasAuth){
            this.handleClick = () => {window.location.href = nextProps.authRedirect}
        } else {
            this.handleClick = event => {
                if (this.props.handleClick){
                    this.props.handleClick();
                }
                tableau.connectionName = this.props.connectionName || "connection";
                tableau.submit();
            };
        }
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
