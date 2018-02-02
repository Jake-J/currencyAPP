const   normalize = require('../styles/normalize.scss'),
        //bootstrap4 = require('../styles/bootstrap.min.css'),
        css = require('../styles/app.scss');

import React from 'react';
import ReactDOM from 'react-dom';

import {CurrenciesList} from './components/CurrenciesList'
import {curriencesFlags} from '../data/flagPaths'
//FLAGS!!!!!!!//////////////////////////////////////////
//http://www.geognos.com/api/en/countries/flag/US.png////
////////////////////////////////////////////////////////
import USDflag from "../imgs/flags/usdflag.jpg";
import GBPflag from "../imgs/flags/gbpflag.jpg"
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      listOfCurrencies: {
        display:false,
        displayFor:null,
        marginTop:null
      },
      currency1: {
        path:USDflag,
        shortcut:"USD",
        symbol:"$",
        decimals:2
      },
      currency2: {
        path:GBPflag,
        shortcut:"GBP",
        symbol:"£",
        decimals:2
      },
      currencyRates: null,
      currencyInput: [0,0]
    }

    this.changeCurrency = this.changeCurrency.bind(this);
    this.resetValues = this.resetValues.bind(this);
    this.swapCurrencies = this.swapCurrencies.bind(this);
  }

  getRates(currencyShortcut,callback){
    fetch('https://api.fixer.io/latest?base='+currencyShortcut)
      .then(response => response.json())
      .then(parsedJson => this.setState({currencyRates:parsedJson},
        ()=>callback ? callback() : null))
      .catch(error => console.log('fetch error - ', error))
  }

  toggleList(forCurrency){
    return () =>{
      const {listOfCurrencies} = this.state; 
      this.setState({
        listOfCurrencies: {
          display:!listOfCurrencies.display,
          displayFor:forCurrency,
          marginTop: (forCurrency === 1) ? -89 : 0
        }
      })
    }
  }

  resetValues(e){
    e.preventDefault();
     this.setState({
      currencyInput: [0,0]
     })
  }

  swapCurrencies(e){
    e.preventDefault();
    const {currency1,currency2} = this.state;
    this.getRates(currency2.shortcut,()=>{
      this.setState({
        currency1: currency2,
        currency2:currency1
      })
    });
    // this.getRates(currency2.shortcut).then(()=>{
    //   this.setState({
    //     currency1: currency2,
    //     currency2:currency1
    //   })
    // });
  }

  changeCurrency(currFlag,currShortcut,currSymbol,roundTo){
    const selectedCurrency = {
      path:currFlag,
      shortcut:currShortcut,
      symbol:currSymbol,
      decimals:roundTo
    };

    const {listOfCurrencies,currency1,currency2,currenciesValues,currencyRates} = this.state; 

    if(listOfCurrencies.displayFor === 1 ){
      this.getRates(currShortcut);
      this.setState({
        currency1:selectedCurrency
      })
    }
    else{
      this.setState({
        currency2:selectedCurrency
      });
    }

    this.setState({
      listOfCurrencies:{
        display:!listOfCurrencies.display
      }
    })
  }

  valideKeyPress(e){
    e.target.value.length >= 20 && e.preventDefault()
    const allowedChars = '0123456789.,';
    function contains(stringValue, charValue) {
        return stringValue.indexOf(charValue) > -1;
    }
    const invalidKey = e.key.length === 1 && !contains(allowedChars, e.key)
            || e.key === '.' && contains(e.target.value, '.');
    invalidKey && e.preventDefault();
  }

  onChangeHandler(e,currency){
    currency === 1 
    ? this.setState({currencyInput:[e.target.value,0]})
    : this.setState({currencyInput:[0,e.target.value]})
  }
  ////////////////////////
  //LIFE CYCLE FUNCTIONs///
  ////////////////////////

  componentWillMount(){
    this.getRates('USD');
  }
  render(){
    const {listOfCurrencies,currency1,currency2,currencyInput,currencyRates} = this.state;
    let currenciesValues = [0,0];

    if(currencyRates !== null && currencyRates.rates[currency2.shortcut]){
        currenciesValues =  currencyInput[0] !== 0
                              ? [currencyInput[0],Math.round(currencyInput[0]*currencyRates.rates[currency2.shortcut]*100)/100] 
                              : [Math.round(currencyInput[1]/currencyRates.rates[currency2.shortcut]*100)/100,currencyInput[1]]
    }
    return(
      <div className="wrapper">
        <h1 className="page-title">Currency Converter</h1>
        <div className="content">
          
          <div className="calculate-box">
          { currenciesValues[0]+currenciesValues[1] != 0 && <span className="calculation">{`${currenciesValues[0] + currency1.symbol} = ${currenciesValues[1] + currency2.symbol}`}</span>}
          { currenciesValues[0]+currenciesValues[1] == 0 && <span>Enter amount you want to change/get below</span>}
          </div>
          
          <form className="currency-form" noValidate>
            {
            /*
              CURRENCY 1
            */
            }
            <div className="currency-box">
              <p className="currency-decription">I have</p>
              <div className="currency-line">
                <div className="currency-line-elem currency-select-btn">
                  <img className="flag-selected" src={currency1.path}/>
                  <span className="currency-shortcut-selected">{currency1.shortcut}</span>
                  <span className="caret" tabIndex="1" onClick={this.toggleList(1)}>
                  {
                    (listOfCurrencies.display && listOfCurrencies.displayFor === 1) 
                    ? <span>&#9650;</span> 
                    : <span>&#9660;</span>
                  }
                  </span>
                </div>
                <label htmlFor="amount" className="currency-line-elem hidden">amount</label>
                <input type="number" 
                       className="currency-amount currencyA-amount currency-line-elem" 
                       tabIndex="2" onChange={e=> this.onChangeHandler(e,1)} 
                       onKeyPress={this.valideKeyPress}  
                       value={parseInt(currenciesValues[0])}
                       ref={(input) => { this.currency1input = input; }}
                       />
              </div>
            </div>
            {
            /*
              CURRENCY 2
            */
             }
            <div className="currency-box">
              <p className="currency-decription">I want</p>
              <div className="currency-line">
                <div className="currency-line-elem currency-select-btn">
                  <img className="flag-selected select-btn-elem" src={currency2.path}/>
                  <span className="currency-shortcut-selected select-btn-elem">{currency2.shortcut}</span>
                  <span className="caret select-btn-elem" tabIndex="3" onClick={this.toggleList(2)}>
                  {
                    (listOfCurrencies.display && listOfCurrencies.displayFor === 2) 
                    ? <span>&#9650;</span> 
                    : <span>&#9660;</span>
                  }
                  </span>
                </div>
                <label htmlFor="amount" className="currency-line-elem hidden">amount</label>
                <input type="number" 
                       className="currency-amount currencyB-amount currency-line-elem" 
                       onChange={e=> this.onChangeHandler(e,2)} 
                       onKeyPress={this.valideKeyPress} 
                       value={currenciesValues[1]}
                       ref={(input) => { this.currency2input = input; }}
                       />
              </div>
            </div>
            {
            /* 
            Curriences Controls 
            */
            }
            <div className="control-area">
              {
                listOfCurrencies.display && <CurrenciesList 
                                            topMargin={this.state.listOfCurrencies.marginTop} 
                                            selectCurrency={this.changeCurrency} 
                                            selectedCurrencies={(this.state.listOfCurrencies.marginTop === 0 ) ? currency2.shortcut : currency1.shortcut}
                                            />
              }
              <div className="control-btns">
                <button className="control-btn" onClick={this.resetValues}>reset</button>
                <button className="control-btn" onClick={this.swapCurrencies}>swap</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
ReactDOM.render(
  <App/>,
  document.getElementById('root')
);

