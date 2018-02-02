import React from 'react';

import {curriencesFlags} from '../../data/flagPaths.js'
const currenciesInfo = require( '../../data/Common-currency.json');

export class CurrenciesList extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            filteredCurrencies:[],
            currenciesList:[],
            filterValidation:''
        }; 

        this.selectCurrency = this.selectCurrency.bind(this);
        this.searchCurrency = this.searchCurrency.bind(this);
    }

    selectCurrency(flagPath,shortcut,name){
        return () =>  this.props.selectCurrency(flagPath,shortcut,currenciesInfo[shortcut].symbol,currenciesInfo[shortcut]["decimal_digits"]);
    }
    searchCurrency(e){
        let {currenciesList} = this.state;
        const userSearchInput = e.target.value.toLocaleUpperCase();
        let filteredCurrencies = []; 
        if(userSearchInput.length <= 3){
            filteredCurrencies = currenciesList.filter((currency)=>{
                return currency.shortcut.indexOf(userSearchInput) >= 0  || currency.name.toLocaleUpperCase().indexOf(userSearchInput) >=0;
            })}
            else if(userSearchInput.length > 3){
                filteredCurrencies = currenciesList.filter((currency)=>{
                    return  currency.name.toLocaleUpperCase().indexOf(userSearchInput) >=0;
                })
            }
        
        if (filteredCurrencies.length === 0 && userSearchInput.length > 0){
          this.setState({
              filterValidation:`No results found for "${e.target.value}"`
          })  
        }else{ 
        this.setState({
            filteredCurrencies:filteredCurrencies,
            filterValidation:''
        })
        }
    }
    generateFlagList(selectedCurrency){
        let {currenciesList} = this.state;
        // console.log(selectedCurrences);
        Object.keys(curriencesFlags).forEach((flag) =>{
            const flagPath = curriencesFlags[flag],
                    shortcut = flag.slice(0,3).toLocaleUpperCase(),
                    name = currenciesInfo[flag.slice(0,3).toLocaleUpperCase()].name;
            if(shortcut !== selectedCurrency){
                currenciesList.push({flagPath,shortcut,name});
            }
        })
        this.setState({currenciesList:currenciesList})

    }
    componentWillMount(){
        this.generateFlagList(this.props.selectedCurrencies);
    }
    render() {
        const listStyle = {
            marginTop:this.props.topMargin
          };
        const {currenciesList,filteredCurrencies,filterValidation} = this.state;
        const curriencesToRender = filteredCurrencies.length > 0 ? filteredCurrencies : currenciesList;
          //console.log(curriencesToRender);
        return(<div className="currency-list-box" style={listStyle} >
                <ul className="curr-list">
                    <li className="search"><input type="text" placeholder="Enter currency" className="search-curr" onChange={this.searchCurrency}/></li>
                    {
                        filterValidation.length > 0
                        ? <li className="curr-item validation-item">{filterValidation}</li>
                        : curriencesToRender.map((item,idx)=>{
                            return (<li className="curr-item" key={idx} onClick={this.selectCurrency(item.flagPath,item.shortcut)}>
                                <img src={item.flagPath} alt="flag" className="curr-flag"  />
                                <span className="curr-shortcut" >{item.shortcut}</span>
                                <span className="curr-fullname" >{item.name}</span>
                            </li>);
                        })
                    }
                </ul>
            </div>
        )
    }
}