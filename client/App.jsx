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

        this.state = {
            hasAuth: false,
            text: "Sign in",
            user: {},
            cols: [{
                id: "likes",
                alias: "likes",
                dataType: "int"
            }, {
                id: "story",
                alias: "story",
                dataType: "string"
            }, {
                id: "created_time",
                alias: "time",
                dataType:"string"
            }]
        };

        fetch("/api/user", {credentials:'same-origin'})
        .then(res => res.json())
        .then(userData => {
            if (userData.feed) {
                this.setState({
                    hasAuth: true,
                    text: "Analyze Data",
                    user: userData
                })
            }
        })
    }

    getData(table, doneCallback) {
        fetch("/api/user", {credentials:'same-origin'})
        .then(res => res.json())
        .then(userData => {
            return userData.feed.map(post =>(
                {
                    likes: post.likes,
                    created_time: post.created_time,
                    story: post.message || post.story
                }
            ))
        }
        doneCallback();
        // fetch("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson")
        // .then(res => res.json())
        // .then(data =>{
        //     let features = data.features;
        //     table.appendRows(features.map(feat =>(
        //         {
        //             mag: feat.properties.mag,
        //             title: feat.properties.title,
        //             url: feat.properties.url,
        //             lon: feat.geometry.coordinates[0],
        //             lat: feat.geometry.coordinates[1]
        //         }
        //     )))
        //     doneCallback();
        // })
        // .catch(err =>{
        //     console.log(err);
        // })
    }

    render() {
        console.log(this.state.hasAuth);
        return (
            <div className={classNames(styles.container, styles.column)}>
                <Wdc
                    cols={this.state.cols}
                    id="earthquakeFeed"
                    alias= "Earthquakes with magnitude greater than 4.5 in the last seven days"
                    getData={this.getData}
                    text={this.state.text}
                    connectionName="USGS Earthquake Feed"
                    authType="custom"
                    hasAuth={this.state.hasAuth}
                    authRedirect="/signup/facebook"
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

