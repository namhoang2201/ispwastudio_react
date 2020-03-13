import React from 'react';
import './App.css';
require('./app.scss')

const $ = window.$
class App extends React.Component {

  getResponse = () => {
    let urlWebsite = $('#url').val()
    if (!urlWebsite) {
      alert('Empty URL !')
    } else {
      const regexUrl = /^(http(s):\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
      if (!urlWebsite.match(regexUrl) || !urlWebsite.includes("http") || !urlWebsite.includes("https")) {
        alert('Your URL is INVALID !')
      } else {
        if (urlWebsite.substring(urlWebsite.length - 1)) {
          urlWebsite = urlWebsite + "/"
        }
        fetch(urlWebsite)
          .then(function (response) {
            if (response.ok) {
              response.text().then((s) => {
                // find all couple tag: <script></script> that include string "client"
                const myRegex = /<script+.+src="+.+\/client+.*><\/script>/gi;
                const match = s.match(myRegex)
                // if all script tags are seperate
                if (match && match.length) {
                  for (let i = 0; i < match.length; i++) {
                    // find the path has key: "client"
                    if (match[i].includes("client")) {
                      const mayBeUrl = match[i]
                      const secondRegex = /".*"/g;
                      const subMatch = mayBeUrl.match(secondRegex)
                      if (subMatch && subMatch.length) {
                        for (let j = 0; j < subMatch.length; j++) {
                          const itemUrl = subMatch[j].replace(/"/gi, "")
                          // fetch data
                          fetch(urlWebsite + itemUrl)
                            .then(function (response) {
                              if (response.ok) {
                                response.text().then((ss) => {
                                  if (ss.includes("M2_VENIA_BROWSER_PERSISTENCE")) {
                                    alert('TRUE ! Your website is PWA STUDIO')
                                  }
                                });
                              } else {
                                continueAnalysis(match)
                              }
                            })
                            .catch(function (error) {
                              alert('Looks like there was a problem: ' + error);
                            });
                        }
                      }
                    }
                  }
                }else{
                  alert('FALSE! Your website is NOT PWA STUDIO')
                }

                // case: a number of adjacent script tags -> continue filter 
                function continueAnalysis(match) {
                  if (match && match.length) {
                    for (let i = 0; i < match.length; i++) {
                      const subRegex = /src="+\/client+.+js">/gi;
                      const match2 = match[i].match(subRegex)
                      if (match2 && match2.length) {
                        // only 1 file
                        for (let k = 0; k < match2.length; k++) {
                          const itemUrl = match2[k].replace(/src="/, "").replace(/">/, "")
                          fetch(urlWebsite + itemUrl)
                            .then(function (response) {
                              if (response.ok) {
                                response.text().then((ss) => {
                                  if (ss.includes("M2_VENIA_BROWSER_PERSISTENCE")) {
                                    alert('TRUE ! Your website is PWA STUDIO')
                                  }
                                });
                              } else {
                                alert('FALSE ! Your website is NOT PWA STUDIO')
                              }
                            })
                            .catch(function (error) {
                              alert('Looks like there was a problem: ' + error);
                            });
                        }
                      }
                    }
                  }
                }
              });
            } else {
              alert('INVALID URL !')
            }
          })
          .catch(function (error) {
            alert('Looks like there was a problem: ' + error);
          });
      }


    }
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-md4-offset-4">
              <div className="title">
                IS PWA STUDIO ?
              </div>
              <div className="form-check">
                <label>Full Website URL:</label>
                <input id="url" name="url" type="url" placeholder="https://" />
                <button className="btn btn-success" onClick={this.getResponse}>Check</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
