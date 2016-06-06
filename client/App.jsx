//Outside
import React, { Component } from 'react';
import { render } from 'react-dom';
import Cookies from 'js-cookie';

//Components
import Wdc from './Wdc.jsx';

//Styling
import styles from './styles.scss';
import classNames from 'classnames';

class App extends Component{

    constructor(props) {
        super(props);

        var cookie = this.parseCookie("token");
        var hasAuth = !!cookie;

        console.log(!!cookie);
        this.state = {
            hasAuth: hasAuth,
            text: hasAuth? "Analyze Data" : "Sign in",
            endPoint: `http://wdc-react.heroku.com/user?userId=${cookie}`,
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
    }

    parseCookie(name){
        let cookie = Cookies.get(name);
        if (!!cookie){
            return cookie.slice(3, -2);
        } else {
            return undefined
        }
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
        return (
            <div className={classNames(styles.container, styles.column)}>
                <Wdc
                    id="facebookFeed"
                    connectionName="Your Facebook Posts"
                    alias= "Recent Facebook Posts"
                    cols={this.state.cols}
                    text={this.state.text}
                    authType="custom"
                    hasAuth={this.state.hasAuth}
                    authRedirect="/signup/facebook"
                    endPoint={this.state.endPoint}
                    gatherCallback={this.cleanData}
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

