import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  static defaultProps = {
    greeting: 'Hello'
  };
  render() {
    return (
      <div>
        {this.props.greeting} World
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('react')
);
