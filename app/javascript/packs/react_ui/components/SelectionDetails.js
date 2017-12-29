import React from "react";

import Orders from "./Orders";

export default class SelectionDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      UI: global.UI,
      rules: rules
    };
  }

  componentWillMount() {
    global.updateSelectionDetails = (UI) => {
      this.setState(UI);
    }
  }

  render() {
    const renderSelectedSquareDetails = () => {
      if (this.state.UI.selection.square) {
        return(
          <div>
            <div><strong>Selection square:</strong></div>
            <div>Coords: {this.state.UI.selection.square.x}, {this.state.UI.selection.square.y}</div>
            <div>No. Units: {this.state.UI.selection.square.units.length}</div>
          </div>
        );
      }
    }

    const renderSelectedUnitDetails = () => {
      if (this.state.UI.selection.unit) {
        return(
          <div>
            <div><strong>Selection square:</strong></div>
            <div>Type: {this.state.UI.selection.unit.type}</div>
            <div>Moves: {this.state.UI.selection.unit.moves}</div>
            <div>Orders: {this.state.UI.selection.unit.orders}</div>
            <div>State: {this.state.UI.selection.unit.state}</div>
          </div>
        );
      }
    }

    const selectionDetailsStyle = {
      position: "absolute",
      bottom: "0",
      left: "0",
      width: "400px",
      height: "200px",
      backgroundColor: "green"
    }
    
    return(
      <div style={selectionDetailsStyle}>
        <div><strong>Tile over:</strong> {this.state.UI.tileMousePosition.x}, {this.state.UI.tileMousePosition.y}</div>
        {renderSelectedSquareDetails()}
        {renderSelectedUnitDetails()}
      </div>
    );
  }
}