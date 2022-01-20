"use strict";

const Core = require("../Core/index");

class GameModel extends Core {
  constructor() {}

  getGameRow() {
    return "Row";
  }

  getGameAll() {
    return "All";
  }
}

const gameModel = new GameModel();

module.exports = gameModel;
