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
        this.connector.getSchema = function(schemaCallback) {
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

            schemaCallback([tableInfo]);
        };

        // this.connector.getSchema = (cb) => {
        //     let tableInfo = {
        //         id: this.props.id || "tableId",
        //         alias: this.props.alias || "tableAlias",
        //         columns: this.props.cols || []
        //     };

        //     console.log(tableInfo);
        //     cb([tableInfo]);
        // };
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
