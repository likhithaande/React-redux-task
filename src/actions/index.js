import axios from "axios";
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'
import thunk from 'redux-thunk';
import Select from 'react-select';
import styles from '../../style/style.css';
require('react-select/dist/react-select.css');

// React component
class UserInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            users:[]
        };
        this.onChange = this.onChange.bind(this);
    }
    onChange(event) {
        this.setState({value: event.value});
        console.log('Select value changed to', event.value);
    }

    componentWillMount() {
        this.props.fetchUsers();
    }

    render () {
        const { value, fetchUsers } = this.props;

        return (
            <div className="section">
                <Select searchable={true} value={this.state.value} onChange={this.onChange} options={this.props.value.map(el => {
                    return { value: el.id, label: el.login }
                })} />
            </div>
        );
    }
}

UserInfo.propTypes = {
    fetchUsers: PropTypes.func.isRequired
};





export const populateUsers = () => (dispatch) => {
    return axios({
        url: 'https://api.github.com/users',
        method: 'get',
    })
        .then(res => {
            dispatch({type: "USERS", payload: res.data});
        })
        .catch(error => {
            dispatch({type: "USERS", payload: error});
        });
};


// Reducer
function userInfo(state = { users: [] }, action) {
    let users = state.users;
    switch (action.type) {
        case 'USERS':
            users = action.payload;
            return {
                ...state,
                   users
            };
        default:
            return state
    }
}



// Store
const store = createStore(userInfo, applyMiddleware(thunk));

// Map Redux state to component props
function mapStateToProps(state) {
    return {
        value: state.users
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    return {
        fetchUsers: () => dispatch(populateUsers())
    }
}

// Connected Component
const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(UserInfo);

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
);