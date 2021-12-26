import React from "react";

function PrioritySelector(props) {
  const { priority, setPriority } = props;

  function onPriorityPlus() {
    setPriority((prevPriority) => {
      if (prevPriority === "medium" || prevPriority === "high") {
        return "high";
      } else if (prevPriority === "low") return "medium";
    });
  }

  function onPriorityMinus() {
    setPriority((prevPriority) => {
      if (prevPriority === "low" || prevPriority === "medium") {
        return "low";
      } else if (prevPriority === "high") return "medium";
    });
  }

  return (
    <div>
      <label>Priority:</label>
      <br />
      <div className="d-flex justify-content-around">
        <div className="d-flex align-items-center">
          <button className="btn btn-primary mx-2" onClick={onPriorityMinus}>
            -
          </button>
          <label className="display-6 mb-1">
            {priority === "low"
              ? " Low "
              : priority === "medium"
              ? "Medium"
              : " High "}
          </label>
          <button className="btn btn-primary mx-2" onClick={onPriorityPlus}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrioritySelector;
