import React, { Component } from "react";
export default class Footer extends Component {
  render() {
    return (
      <div className="footer">
      <hr/>
        <i>
          Disclaimer: This website was made for educational purposes
          exclusively. It does not promote trade or investment in
          cryptocurrencies. The accuracy of the data is to the best of
          the creator's ability and mistakes are highly probable. Please do not use
          this site to make financial decisions of any kind. The cryptocurrency market is extremely volatile and dangerous. Data may be wrong and/or change significantly within fractions of a second. Do not invest in anything you do not fully understand. Conduct your own research. Do not invest anything you are not willing to lose. This website is not affiliated with any organization that is mentioned or not mentioned in it.
        <p/>
        <a href = "https://github.com/avinoamMO" target="_blank"><img  width="40"src='https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'/></a>
        
        </i>
      </div>
    );
  }
}
