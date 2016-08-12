import React from 'react';
import Relay from 'react-relay';

class Quote extends React.Component {
  render() {
    return (
      <blockquote>
        <p>{this.props.quote.text}</p>
        <footer>{this.props.quote.author}</footer>
      </blockquote>
    );
  }
}

Quote = Relay.createContainer(Quote, {
  fragments: {
    quote: () => Relay.QL `
      fragment OneQuote on Quote {
        text
        author
      }
    `
  }
});

export default Quote;
