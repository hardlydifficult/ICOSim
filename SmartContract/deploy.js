const Nebulas = require('nebulas');
const fs = require('fs');
const consts = require('../static/consts');
let conf = null;

try{
  conf = require('./config.json');
}catch (e) {
  console.log('failed to load config.json. Try to run "yarn run generateconfig" first.');
  process.exit(1);
}

if(conf.version !==  consts.CONF_VERSION){
  console.log('config outdated.');
  process.exit(1);
}

const contractSource = fs.readFileSync('./contract.js').toString();
const apiUrl = "https://testnet.nebulas.io";//"http://localhost:8685";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var options;
var receipt;
let neb = new Nebulas.Neb();

async function run(){
  let account = new Nebulas.Account();
  account.setPrivateKey(conf.account.privateKey);

  neb.setRequest(new Nebulas.HttpRequest(apiUrl));
  let nebState = await neb.api.getNebState();
  let accountState = await neb.api.getAccountState(account.getAddressString());

  options = {
    from : account,
    to : account.getAddressString(),
    nonce : parseInt(accountState.nonce) + 1,
    gasPrice: 1000000,
    gasLimit: 2000000,
    contract : {
      source : contractSource,
      sourceType : 'js',
      args : '[0]',
      function : 'save'
    },
    chainID : nebState.chain_id
  };

  let transaction = new Nebulas.Transaction(options);
  transaction.signTransaction();

  let payload = {
    data : transaction.toProtoString()
  };
  let response = await neb.api.sendRawTransaction(payload);
  console.log(response);
  await sleep(2000);

  let attempt = 0;
  while(1===1){
    receipt = await neb.api.getTransactionReceipt({hash:response.txhash});

    if(receipt.status === 0){
      console.log('Deploy failed');
      console.log(receipt);
      process.exit(1);
    }else if(receipt.status === 1){
      console.log(`Transaction no longer pending. Receipt:`);
      console.log(receipt);

      if(receipt.contract_address && receipt.contract_address.length > 0){
        let toSource = require('tosource');
        //write to the config file
        let content = "/*AUTOGENERATED BY DEPLOY SCRIPT. DO NOT EDIT*/\n";
        let obj = {
          apiUrl : apiUrl,
          contract : receipt.contract_address
        };
        content += "neb_contract=" + toSource(obj) + ";";
        fs.writeFileSync('../ICOSim/src/static/settings.js', content);

        await callMethod("setStartingResources", "42"); 
        await callMethod("setWorldResources", "5555555555"); 
        await callMethod("setEventConfig", {
          interval: "10", 
          min_reward: "10000", max_reward: "9999999999", 
          min_reward_percent: "0.1", max_reward_percent: "100", 
          min_length: "2", max_length: "2"});

        var item_make_a_commit = "Make a Commit on Github";
        var items = [
          // Raw production
          {name: item_make_a_commit, sort_id: 0, start_price: "1", nas_price: "1", resources_per_s: "1"},
          {name: "Announce an Announcement", sort_id: 1, start_price: "30", nas_price: "30", resources_per_s: "5"},
          {name: "Publish Performance Numbers", sort_id: 2, start_price: "500", nas_price: "500", resources_per_s: "10"},
          {name: "Do a Giveaway on Twitter", sort_id: 3, start_price: "15000", nas_price: "15000", resources_per_s: "25"},
          {name: "Incite FOMO", sort_id: 4, start_price: "420000", nas_price: "420000", resources_per_s: "50"},
          {name: "Buy Exchange Listing", sort_id: 5, start_price: "20000000", nas_price: "20000000", resources_per_s: "100"},
          {name: "Air Drop", sort_id: 6, start_price: "3000000000", nas_price: "3000000000", resources_per_s: "500"},
          {name: "Announce Partnership", sort_id: 7, start_price: "2000000000000", nas_price: "2000000000000", resources_per_s: "10000"},

          // Bonuses
          {name: "Tom Lee", sort_id: 8, start_price: "500000", nas_price: "1", bonus_multiplier: "1"},
          {name: "Craig Grant", sort_id: 9, start_price: "35000000", nas_price: "1", bonus_multiplier: "2"},
          {name: "Ian Balina", sort_id: 10, start_price: "1000000000", nas_price: "1", bonus_multiplier: "5"},
          {name: "Suppoman", sort_id: 11, start_price: "10000000000", nas_price: "1", bonus_multiplier: "10"},
          {name: "Trevon James", sort_id: 12, start_price: "100000000000", nas_price: "1", bonus_multiplier: "15"},
          {name: "Roger Ver", sort_id: 13, start_price: "100000000000", nas_price: "1", bonus_multiplier: "20"},
          {name: "John McAfee", sort_id: 14, start_price: "10000000000000", nas_price: "1", bonus_multiplier: "25"},
          {name: "Carlos Matos", sort_id: 15, start_price: "999000000000000", nas_price: "1", bonus_multiplier: "50"},
        ]

        for(var i = 0; i < items.length; i++)
        {
          await callMethod("createItem", items[i]); 
        }

        // for(var i = 0; i < items.length; i++)
        // {
        //   nebWrite("createItem", [items[i]]); 
        //   sleep(5000);
        // }
        var my_wallet = "n1S5JNP13pnoyswKbGtrtE3Bexz6pbtKaPj";
        await callMethod("changeOwner", my_wallet);

        // For testing: 
        await callMethod("isOwner");
        await callMethod("getOrCreateUser");
        await callMethod("getUser", ["n1S5JNP13pnoyswKbGtrtE3Bexz6pbtKaPj"]);
        await callMethod("launchICO", ["HardlyValuable", "HV1"])
        await callMethod("getActiveICO");
        await callMethod("getICO");
        await callMethod("getICOId", ["HV"]);
        await callMethod("getSmartContractBalance");
        await callMethod("getMyResources");
        await callMethod("getMyResourcesNasValue");
        await callMethod("getMyItemProductionRate", item_make_a_commit);
        await callMethod("getMyProductionRate");
        await callMethod("getTimePassed");
        await callMethod("getMyProductionSinceLastRedeem");
        await callMethod("getMyItemBonus", item_make_a_commit);
        await callMethod("getMyBonus");
        await callMethod("getMyPendingResources");
        await callMethod("redeemResources");
        await callMethod("getAllItemNames");
        await callMethod("getItemRaw", item_make_a_commit);
        await callMethod("getItem", item_make_a_commit);
        await callMethod("getMyItemCount", item_make_a_commit);
        await callMethod("getTotalCostFor", [item_make_a_commit, "10000"]);
        await callMethod("getMyItemPrice", [item_make_a_commit, "10000"]);
        await callMethod("getMaxICanAfford", [item_make_a_commit]);
        await callMethod("buy", ["Make a Commit on Github", "3"]);
        await callMethod("getInfo");
        await callMethod("getBestKnownScammers");
        await callMethod("getBestKnownScammers", [1, 10]);
        await callMethod("getICOStats");
        await callMethod("getCoinMarketCaps");
        await callMethod("getCoinMarketCaps", [1, 10]);
        await callMethod("getList", "all_items");
        await callMethod("exitScam");
        await callMethod("launchICO", ["HardlyValuable", "HV2"])
      }

      return;
    }else if(receipt.status === 2){
      attempt++;
      console.log(`Transaction pending... attempt: ${attempt} - ${new Date()}`);
      if(attempt === 1)
        console.log(receipt);
      await sleep(3000);
    }
  }
}

run();

async function callMethod(method, args)
{
  if(!(args instanceof Array))
  {
    args = [args];
  }
  options.to = receipt.contract_address;
  options.contract = {
    function: method,
    args: JSON.stringify(args)
  };
  options.nonce++;
  var transaction = new Nebulas.Transaction(options);
  transaction.signTransaction();

  let payload = {
    data : transaction.toProtoString()
  };
  await neb.api.sendRawTransaction(payload);
  console.log("sent: " + JSON.stringify(payload));
}