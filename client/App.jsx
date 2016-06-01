//Outside
import React, { Component } from 'react';
import { render } from 'react-dom';

//Components
import Wdc from './Wdc.jsx';

//Styling
import styles from './styles.scss';
import classNames from 'classnames';

class App extends Component{

    constructor(props) {
        super(props);
        this.cols = [{
            id: "mag",
            alias: "magnitude",
            dataType: "float"
        }, {
            id: "title",
            alias: "title",
            dataType: "string"
        }, {
            id: "url",
            alias: "url",
            dataType:"string"
        }, {
            id: "lat",
            alias: "latitude",
            dataType: "float"
        }, {
            id: "lon",
            alias: "longitude",
            dataType: "float"
        }];
    }

    getData(table, doneCallback) {
        var mag = 0,
            title = "",
            url = "",
            lat = 0,
            lon = 0;

        fetch("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson")
        .then(res =>{
            let features = res.jsons().features;
            table.appendRows(features.map(feat =>(
                {
                    ...feat.props,
                    lon: feat.geometry.coordinates[0],
                    lat: feat.geometry.coordinates[1]
                }
            )))
            doneCallback();
        })
        .catch(err =>{
            console.log(err);
        })
    }

    render() {
        return (
            <div className={classNames(styles.container, styles.column)}>
                <Wdc
                    cols={this.cols}
                    id="earthquakeFeed"
                    alias= "Earthquakes with magnitude greater than 4.5 in the last seven days"
                    getData={this.getData}
                    text="Collect Data"
                    connectionName="USGS Earthquake Feed"
                />
            </div>
        );
    }
}

export default App;

function run() {
    render(<App />, document.getElementById("target"));
}

if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', run);
} else {
    window.attachEvent('onload', run);
}

