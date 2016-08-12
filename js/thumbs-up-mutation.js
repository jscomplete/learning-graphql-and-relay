import Relay from 'react-relay';

class ThumbsUpMutation extends Relay.Mutation {

  static fragments = {
    quote: () => Relay.QL `
      fragment on Quote {
        id
      }
    `
  };

  getMutation() {
    return Relay.QL `
      mutation {
        thumbsUp
      }
    `;
  }

  getVariables() {
    return {
      quoteId: this.props.quote.id
    };
  }

  getFatQuery() {
    return Relay.QL `
      fragment on ThumbsUpMutationPayload {
        quote {
          likesCount
        }
      }
    `;
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          quote: this.props.quote.id
        }
      }
    ];
  }

}

export default ThumbsUpMutation;
