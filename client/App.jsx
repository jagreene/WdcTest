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
        // fetch("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", {mode: 'cors'})
        // .then(res => res.json())
        // .then(data =>{
        //     console.log(data.features.map(feat =>(
        //         {
        //             mag: feat.properties.mag,
        //             title: feat.properties.title,
        //             url: feat.properties.url,
        //             lon: feat.geometry.coordinates[0],
        //             lat: feat.geometry.coordinates[1]
        //         }
        //     )))
        // })

        this.state = {
            hasAuth: false,
            handleClick: () => {window.location.href = '/signup/facebook'},
            text: "Sign in",
            cols: [{
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
            }]
        };

        fetch("/api/user", {credentials:'same-origin'})
        .then(res => res.json())
        .then(userData => {
            if (userData.feed) {
                this.setState({
                    hasAuth: true,
                    handleClick: () => {},
                    text: "Collect Data"
                })
            }
            console.log(this.state.hasAuth);
        })
    }

    getData(table, doneCallback) {
        fetch("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson")
        .then(res => res.json())
        .then(data =>{
            let features = data.features;
            table.appendRows(features.map(feat =>(
                {
                    mag: feat.properties.mag,
                    title: feat.properties.title,
                    url: feat.properties.url,
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
        console.log(this.state.text);
        return (
            <div className={classNames(styles.container, styles.column)}>
                <Wdc
                    cols={this.state.cols}
                    id="earthquakeFeed"
                    alias= "Earthquakes with magnitude greater than 4.5 in the last seven days"
                    getData={this.getData}
                    text={this.state.text}
                    handleClick={this.state.handleClick}
                    connectionName="USGS Earthquake Feed"
                    authType="basic"
                    hasAuth={this.state.hasAuth}
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

