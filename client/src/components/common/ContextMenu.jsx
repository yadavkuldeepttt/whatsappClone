import React, { useEffect, useRef } from "react";

function ContextMenu({ options, coordinates, contextMenu, setContextMenu }) {
  const contextMenuRef = useRef(null);
  const handleClick = (e, callback) => {
    e.stopPropagation();
    setContextMenu(false);
    callback();
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id !== "context-opener") {
        if (
          contextMenuRef.current &&
          !contextMenuRef.current.contains(e.target)
        ) {
          setContextMenu(false);
        }
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [coordinates, setContextMenu, contextMenuRef]);
  


  return (
    <div
      className={`bg-dropdown-background fixed py-2 shadow-xl z-[100]`}
      ref={contextMenuRef}
      style={{
        left: coordinates.x,
        top: coordinates.y,
      }}>
      <ul>
        {options.map(({ name, callback }) => (
          <li
            key={name}
            onClick={(e) => handleClick(e, callback)}
            className="px-5 py-2 cursor-pointer">
            <span className="text-white">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextMenu;
