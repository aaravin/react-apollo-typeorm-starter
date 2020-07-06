/* eslint-disable */
import React from 'react';
import {
  Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import history from '../misc/history';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import './App.css';

const PrivateRoute = ({ component, ...rest }: any) => {
  const routeComponent = (props: any) => (
    localStorage.getItem('instacraft_token')
      ? React.createElement(component, props)
      : <Redirect to={{ pathname: '/login' }} />
  );
  return <Route {...rest} render={routeComponent} />;
};

class App extends React.Component {
  unlisten: any;

  componentWillMount() {
    this.unlisten = history.listen((_location, _action) => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  handleLogoutClick = () => {
    FB.getLoginStatus(response => {
      if (response.status === 'connected') {
        FB.logout((res) => {
          localStorage.removeItem('instacraft_token');
          history.push('/login');
        });
      }
    });
  }

  renderLogOutButton = () => (localStorage.getItem('instacraft_token')
    ? <span onClick={this.handleLogoutClick}>Log Out</span>
    : null)

  render() {
    return (
      <Router history={history}>
        <div className="App">
          <section className="app-header-section">
            <header className="app-header">
              <h1>INSTACRAFT</h1>
              {this.renderLogOutButton()}
            </header>
          </section>
          <section className="app-content-section">
            <div className="app-content">
              <Switch>
                <Route path="/login" component={LoginPage} />
                <PrivateRoute path="/" component={HomePage} />
              </Switch>
            </div>
          </section>
        </div>
      </Router>
    );
  }
}

export default App;
