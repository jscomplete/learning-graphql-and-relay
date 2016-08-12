import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import Quote from './quote';

class QuotesLibrary extends React.Component {
  state = { allQuotes: [] };

  componentDidMount() {
    fetch(`/graphql?query={
                            allQuotes {
                              id,
                              text,
                              author
                            }
                          }`)
      .then(response => response.json())
      .then(json => this.setState(json.data))
      .catch(ex => console.error(ex))
  }

  render() {
    return (
      <div className="quotes-list">
        {this.state.allQuotes.map(quote =>
          <Quote key={quote.id} quote={quote} />
        )}
      </div>
    )
  }
}

QuotesLibrary = Relay.createContainer(QuotesLibrary, {
  fragments: {}
});

class AppRoute extends Relay.Route {
  static routeName = 'App';
}

ReactDOM.render(
  <Relay.RootContainer
    Component={QuotesLibrary}
    route={new AppRoute()}
  />,
  document.getElementById('react')
);
