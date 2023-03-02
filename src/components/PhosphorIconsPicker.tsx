import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { FC, useState } from "react";
import get from "lodash/get";

import { icons } from "../icons/icons";

import "./styles.css";
import { Canvas, TextInput } from "datocms-react-ui";

type Props = {
  ctx: RenderFieldExtensionCtx;
};

const PhosphorIconsPicker: FC<Props> = ({ ctx }) => {
  const initialValue = get(ctx?.formValues, ctx?.fieldPath || "");
  const [showIcons, setShowIcons] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIcon, setSelectedIcon] = useState(
    typeof initialValue === "string" ? initialValue : null
  );

  const handleIconClick = (icon: string) => {
    setSelectedIcon(icon);
    ctx?.setFieldValue(ctx.fieldPath, icon ? icon : "");
  };

  const allIcons = [...icons]
    .filter((icon) => {
      if (searchTerm) {
        return icon.indexOf(searchTerm.toLowerCase()) !== -1;
      } else {
        return icon;
      }
    })
    .sort((a, b) => {
      const aName = `${a}`;
      const bName = `${b}`;

      if (aName > bName) {
        return 1;
      } else if (aName < bName) {
        return -1;
      }
      return 0;
    });

  const pageSize = 30;
  const workingIcons = [...allIcons].slice(
    (currentPage - 1) * pageSize,
    (currentPage - 1) * pageSize + pageSize
  );
  const totalPages = Math.ceil(allIcons.length / pageSize);

  return (
    <Canvas ctx={ctx}>
      <div className="App">
        {!selectedIcon && (
          <>
            <div>
              <span className="toggler" onClick={() => setShowIcons((s) => !s)}>
                {showIcons ? "Hide" : "Show"} all icons
              </span>
            </div>
            {!!showIcons && (
              <div className="search-input-wrapper">
                <TextInput
                  value={searchTerm}
                  onChange={(newValue) => {
                    setCurrentPage(1);
                    setSearchTerm(newValue);
                  }}
                  placeholder="Search..."
                  type="search"
                />
              </div>
            )}
          </>
        )}
        {!!selectedIcon && (
          <div
            className="selected-icon"
            key={`${selectedIcon}`}
          >
            <div>
              <i className={`ph-${selectedIcon}-fill`}></i>
            </div>
            <span>{selectedIcon}</span>
            <div
              onClick={() => {
                ctx?.setFieldValue(ctx.fieldPath, null);
                setSelectedIcon(null);
              }}
              className="remove-text"
            >
              Remove
            </div>
          </div>
        )}
        <div className="grid">
          {!selectedIcon &&
            !!showIcons &&
            workingIcons.map((icon) => {
              return (
                <div
                  onClick={() =>
                    handleIconClick(icon)
                  }
                  className="icon"
                  key={icon}
                >
                  <div>
                    <i className={`ph-${icon}-fill`}></i>
                  </div>
                  <span>{icon}</span>
                </div>
              );
            })}
        </div>
        {!workingIcons.length && <h3>No icons found.</h3>}
        {!selectedIcon && !!showIcons && !!workingIcons.length && (
          <div className="pagination">
            <div>
              <div>
                Page {currentPage} of {totalPages}
              </div>
              <div className="pages">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="btn"
                  style={{
                    background: ctx?.theme.primaryColor || "black",
                  }}
                >
                  <i className="ph-caret-circle-double-left"></i>
                </button>
                <button
                  onClick={() => setCurrentPage((s) => s - 1)}
                  disabled={currentPage === 1}
                  className="btn"
                  style={{
                    background: ctx?.theme.primaryColor || "black",
                  }}
                >
                  <i className="ph-caret-circle-left"></i>
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((s) => s + 1)}
                  className="btn"
                  style={{
                    background: ctx?.theme.primaryColor || "black",
                  }}
                >
                  <i className="ph-caret-circle-right"></i>
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="btn"
                  style={{
                    background: ctx?.theme.primaryColor || "black",
                  }}
                >
                  <i className="ph-caret-circle-double-right"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Canvas>
  );
};

export default PhosphorIconsPicker;
