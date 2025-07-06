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

  Prediction[] public predictions;

  function storePrediction(string memory coinAddress, uint256 predictedValue, string memory postTime) public {
    predictions.push(Prediction(msg.sender, coinAddress, predictedValue, block.timestamp, postTime));
  }

  function getPredictions() public view returns (Prediction[] memory) {
    return predictions;
  }
}