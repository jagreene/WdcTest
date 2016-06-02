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
        var myConnector = tableau.makeConnector();

        // Define the schema
        myConnector.getSchema = function(schemaCallback) {
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

        // Download the data
        myConnector.getData = function(table, doneCallback) {
            var mag = 0,
                title = "",
                url = "",
                lat = 0,
                lon = 0;

            $.getJSON("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(resp) {
                var feat = resp.features,
                    tableData = [];

                // Iterate over the JSON object
                for (var i = 0, len = feat.length; i < len; i++) {
                    mag = feat[i].properties.mag;
                    title = feat[i].properties.title;
                    url = feat[i].properties.url;
                    lon = feat[i].geometry.coordinates[0];
                    lat = feat[i].geometry.coordinates[1];

                    tableData.push({
                        "mag": mag,
                        "title": title,
                        "url": url,
                        "lon": lon,
                        "lat": lat
                    });

                }

                table.appendRows(tableData);
                doneCallback();
            });
        };

        tableau.registerConnector(myConnector);

        // Create event listeners for when the user submits the form
        $(document).ready(function() {
            $("#submitButton").click(function() {
                tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
                tableau.submit(); // This sends the connector object to Tableau
            });
        });
        // this.connector = tableau.makeConnector();
        // this.connector.getSchema = function(schemaCallback) {
        //     var cols = [{
        //         id: "mag",
        //         alias: "magnitude",
        //         dataType: tableau.dataTypeEnum.float
        //         }, {
        //         id: "title",
        //         alias: "title",
        //         dataType: tableau.dataTypeEnum.string
        //         }, {
        //         id: "url",
        //         alias: "url",
        //         dataType: tableau.dataTypeEnum.string
        //     }, {
        //         id: "lat",
        //         alias: "latitude",
        //         dataType: tableau.dataTypeEnum.float
        //     }, {
        //         id: "lon",
        //         alias: "longitude",
        //         dataType: tableau.dataTypeEnum.float
        //     }];

        //     var tableInfo = {
        //         id: "earthquakeFeed",
        //         alias: "Earthquakes with magnitude greater than 4.5 in the last seven days",
        //         columns: cols
        //     };

        //     console.log(tableInfo);
        //     schemaCallback([tableInfo]);
        // };

        // // Download the data
        // this.connector.getData = function(table, doneCallback) {
        //     var mag = 0,
        //         title = "",
        //         url = "",
        //         lat = 0,
        //         lon = 0;

        //         $.getJSON("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(resp) {
        //         var feat = resp.features,
        //         tableData = [];

        //         // Iterate over the JSON object
        //         for (var i = 0, len = feat.length; i < len; i++) {
        //             mag = feat[i].properties.mag;
        //             title = feat[i].properties.title;
        //             url = feat[i].properties.url;
        //             lon = feat[i].geometry.coordinates[0];
        //             lat = feat[i].geometry.coordinates[1];

        //             tableData.push({
        //                 "mag": mag,
        //                 "title": title,
        //                 "url": url,
        //                 "lon": lon,
        //                 "lat": lat
        //             });

        //             }

        //             table.appendRows(tableData);
        //             doneCallback();
        //     });
        // };

        // // this.connector.getSchema = (cb) => {
        // //     let tableInfo = {
        // //         id: this.props.id || "tableId",
        // //         alias: this.props.alias || "tableAlias",
        // //         columns: this.props.cols || []
        // //     };

        // //     console.log(tableInfo);
        // //     cb([tableInfo]);
        // // };
        // // this.connector.getData = this.props.getData;
        // tableau.registerConnector(this.connector);

        // this.handleClick = event => {
        //     // if (this.props.handleClick){
        //     //     this.props.handleClick();
        //     // }
        //     // tableau.connectionName = this.props.connectionName || "connection";
        //     // tableau.submit();
        //     tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
        //     tableau.submit(); // This sends the connector object to Tableau
        // };
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
