import React, { Component } from "react";
import debounce from "lodash.debounce";

import setsDb from "./db/sets.csv.json";
import productNotes from "./db/product_notes.json";
import perchaseHistories from "./db/purchase_histories.json";
import { queryProductItemBySetNum, getSetByKeyword } from "./helpers";
import Product from "./Product";

export default class SearchBricks extends Component {
  constructor(props) {
    super(props);
    this.searchSetByKeyword = debounce(this.searchSetByKeyword, 1000);
  }

  state = {
    value: "",
    /** @type {Brickable~Set} LEGO set */
    set: null,
    /** @type {ProductNote} */
    productNote: null,
    /** @type {PurchaseHistory} */
    purchaseHistory: null,
  };

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
    this.searchSetByKeyword(event.target.value);
  };

  searchSetByKeyword = (keyword) => {
    const foundSet = getSetByKeyword(setsDb, keyword);
    if (!foundSet) {
      this.setState({ set: null });
      return;
    }

    this.setState({
      set: foundSet,
      productNote: queryProductItemBySetNum(productNotes, foundSet.set_num),
      purchaseHistory: queryProductItemBySetNum(
        perchaseHistories,
        foundSet.set_num
      ),
    });
  };

  renderContent = () => {
    const { value, set, productNote, purchaseHistory } = this.state;

    if (!value) {
      return "Please input";
    }

    if (!set) {
      return "No data (not found in sets DB)";
    }

    return (
      <Product
        set={set}
        productNote={productNote}
        purchaseHistory={purchaseHistory}
      />
    );
  };

  render() {
    return (
      <div>
        <input onChange={this.handleChange}></input>
        <div>{this.renderContent()}</div>
      </div>
    );
  }
}
