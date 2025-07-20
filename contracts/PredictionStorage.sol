// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PredictionStorage {
  struct Prediction {
    address user;
    string coinAddress;
    uint256 predictedValue;
    uint256 timestamp;
    string postTime;
  }

  struct Trade {
    address user;
    string coinAddress;
    uint256 amount;
    bool isBuy;
    uint256 timestamp;
  }

  Prediction[] public predictions;
  Trade[] public trades;

  function storePrediction(string memory coinAddress, uint256 predictedValue, string memory postTime) public {
    predictions.push(Prediction(msg.sender, coinAddress, predictedValue, block.timestamp, postTime));
  }

  function storeTrade(string memory coinAddress, uint256 amount, bool isBuy) public {
    trades.push(Trade(msg.sender, coinAddress, amount, isBuy, block.timestamp));
  }

  function getPredictions() public view returns (Prediction[] memory) {
    return predictions;
  }

  function getTrades() public view returns (Trade[] memory) {
    return trades;
  }
}