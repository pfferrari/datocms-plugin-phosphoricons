import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { FC, useState } from "react";
import get from "lodash/get";
import { icons as iconData } from "@phosphor-icons/core";

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

  const allIcons = [...iconData]
    .filter((icon) => {
      if (searchTerm) {
        return icon.name.indexOf(searchTerm.toLowerCase()) !== -1;
      } else {
        return icon.name;
      }
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
              <i className={`ph-fill ph-${selectedIcon}`}></i>
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
                    handleIconClick(icon.name)
                  }
                  className="icon"
                  key={icon.name}
                >
                  <div>
                    <i className={`ph-fill ph-${icon.name}`}></i>
                  </div>
                  <span>{icon.name}</span>
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
                  <i className="ph-fill ph-caret-circle-double-left"></i>
                </button>
                <button
                  onClick={() => setCurrentPage((s) => s - 1)}
                  disabled={currentPage === 1}
                  className="btn"
                  style={{
                    background: ctx?.theme.primaryColor || "black",
                  }}
                >
                  <i className="ph-fill ph-caret-circle-left"></i>
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((s) => s + 1)}
                  className="btn"
                  style={{
                    background: ctx?.theme.primaryColor || "black",
                  }}
                >
                  <i className="ph-fill ph-caret-circle-right"></i>
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="btn"
                  style={{
                    background: ctx?.theme.primaryColor || "black",
                  }}
                >
                  <i className="ph-fill ph-caret-circle-double-right"></i>
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
