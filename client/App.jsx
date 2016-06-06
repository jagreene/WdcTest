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

    cleanData(data) {
        return data.feed.map(post =>(
            {
                likes: post.likes,
                created_time: post.created_time,
                story: post.message || post.story
            }
        ))
    }

    render() {
        console.log(this.state.hasAuth);
        return (
            <div className={classNames(styles.container, styles.column)}>
                <Wdc
                    cols={this.state.cols}
                    id="earthquakeFeed"
                    alias= "Earthquakes with magnitude greater than 4.5 in the last seven days"
                    text={this.state.text}
                    connectionName="USGS Earthquake Feed"
                    authType="custom"
                    hasAuth={this.state.hasAuth}
                    authRedirect="/signup/facebook"
                    password={this.state.user.id}
                    endPoint={`http://wdc-react.heroku.com/api/user?userId=${this.state.user.id}`}
                    gatherCallback={cleanData}
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

