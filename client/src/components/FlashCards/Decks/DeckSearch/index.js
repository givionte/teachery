import React, { Component } from "react";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";

import TagLink from "../DeckItem/DeckTags/TagLink";

const TAG_SEARCH_QUERY = gql`
  query TagSearchQuery($tagName: String!) {
    getTagsByName(tagName: $tagName) {
      tagName
      id
    }
  }
`;

class Search extends Component {
  state = {
    tags: [],
    tagName: "",
    noResult: false
  };

  render() {
    return (
      <div>
        <div>
          Search:
          <input
            type="text"
            onChange={e =>
              this.setState({ tagName: e.target.value, noResult: false })
            }
            placeholder="Search by language or tag"
          />
          <button onClick={() => this._executeSearch()}>OK</button>
          {this.state.noResult && (
            <h5>Sorry, your search did not find any results...</h5>
          )}
        </div>
        {this.state.tags.map(tag => (
          <TagLink key={tag.id} tag={tag} />
        ))}
      </div>
    );
  }

  _executeSearch = async () => {
    const { tagName } = this.state;
    const result = await this.props.client.query({
      query: TAG_SEARCH_QUERY,
      variables: { tagName }
    });
    if (tagName === "") {
      this.setState({ noResult: true });
    } else if (result.data.getTagsByName.length === 0) {
      this.setState({ noResult: true });
    } else {
      const tags = result.data.getTagsByName;
      this.setState({ tags });
    }
  };
}

export default withApollo(Search);